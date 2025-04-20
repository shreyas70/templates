import argparse
import sys
from pathlib import Path
import pyperclip

# --- Configuration ---
# Add or remove file extensions you want to include.
# Use lowercase and include the leading dot.
INCLUDED_EXTENSIONS = {
    '.py', '.txt', '.md', '.json', '.yaml', '.yml', '.html', '.css',
    '.js', '.ts', '.jsx', '.tsx', '.sh', '.bat', '.csv', '.xml',
}

# Maximum file size in bytes to read (e.g., 1MB = 1 * 1024 * 1024)
MAX_FILE_SIZE_BYTES = 1 * 1024 * 1024  # 1 MB limit


def should_skip_directory(dir_path):
    """
    Determines if a directory should be skipped (e.g., hidden directories, node_modules, etc.)
    
    Args:
        dir_path (Path): The directory path to check
        
    Returns:
        bool: True if directory should be skipped, False otherwise
    """
    # Skip hidden directories (starting with .)
    if dir_path.name.startswith('.'):
        return True
    
    # Skip common directories to exclude
    exclude_dirs = {'node_modules', 'venv', '.git', '__pycache__', 'dist', 'build'}
    if dir_path.name in exclude_dirs:
        return True
    
    return False


def read_files_to_string(folder_path_str, recursive=True, extensions=None, max_size=None):
    """
    Reads files from a specified folder (optionally recursively) and
    returns a single string with filenames and content, suitable for LLMs.

    Args:
        folder_path_str (str): The path to the folder.
        recursive (bool): Whether to search subdirectories. Defaults to True.
        extensions (set, optional): A set of file extensions (lowercase, including '.')
                                    to include (e.g., {'.py', '.txt'}).
                                    If None, attempts to read all files.
                                    Defaults to None.
        max_size (int, optional): Maximum file size in bytes to include.
                                  If None, no size limit. Defaults to None.

    Returns:
        str: A formatted string containing filenames and their content,
             or an error message if the folder is invalid or no files are found.
    """
    folder_path = Path(folder_path_str).resolve()  # Use absolute path for clarity
    output_parts = []

    if not folder_path.is_dir():
        return f"Error: Folder not found or is not a directory: {folder_path_str}"

    print(f"Scanning folder: {folder_path}", file=sys.stderr)
    if recursive:
        print("Searching recursively.", file=sys.stderr)
    if extensions:
        print(f"Including extensions: {', '.join(extensions)}", file=sys.stderr)
    else:
        print("Including all file extensions.", file=sys.stderr)
    if max_size is not None:
        print(f"Skipping files larger than {max_size / 1024 / 1024:.2f} MB.", file=sys.stderr)

    found_files_count = 0
    skipped_extension_count = 0
    skipped_size_count = 0
    skipped_read_error_count = 0
    skipped_hidden_dir_count = 0

    # Use Path.walk() instead of glob to have more control over directory traversal
    if recursive:
        items = []
        for root, dirs, files in folder_path.walk():
            # Modify dirs in-place to skip directories we don't want to traverse
            dirs[:] = [d for d in dirs if not should_skip_directory(Path(root) / d)]
            items.extend([Path(root) / file for file in files])
    else:
        items = [item for item in folder_path.iterdir() if item.is_file()]

    for item_path in items:
        if item_path.is_file():
            relative_path = item_path.relative_to(folder_path)
            file_extension = item_path.suffix.lower()

            # 1. Filter by extension if specified
            if extensions and file_extension not in extensions:
                skipped_extension_count += 1
                continue

            # 2. Filter by size if specified
            if max_size is not None:
                try:
                    file_size = item_path.stat().st_size
                    if file_size > max_size:
                        print(f"Skipping (too large: {file_size / 1024 / 1024:.2f} MB): {relative_path}", file=sys.stderr)
                        skipped_size_count += 1
                        continue
                except OSError as e:
                    print(f"Warning: Could not get size for {relative_path}: {e}", file=sys.stderr)
                    # Decide whether to skip or try reading anyway (let's try reading)

            # 3. Try reading the file
            print(f"Processing: {relative_path}", file=sys.stderr)  # Progress indicator
            header = f"--- File: {relative_path} ---\n"
            footer = f"\n--- End File: {relative_path} ---\n\n"
            content = ""

            try:
                # Try reading as UTF-8, ignore errors for robustness against slightly malformed text files
                content = item_path.read_text(encoding='utf-8', errors='ignore')
                output_parts.append(header + content + footer)
                found_files_count += 1
            except UnicodeDecodeError:
                # This usually means it's a binary file or wrong encoding
                content = f"--- Skipped reading file: Could not decode content (likely binary or wrong encoding) ---"
                print(f"Skipping (read error - decode): {relative_path}", file=sys.stderr)
                output_parts.append(header + content + footer)  # Include marker even if skipped
                skipped_read_error_count += 1
            except PermissionError:
                content = f"--- Skipped reading file: Permission denied ---"
                print(f"Skipping (read error - permission): {relative_path}", file=sys.stderr)
                output_parts.append(header + content + footer)
                skipped_read_error_count += 1
            except Exception as e:
                # Catch other potential errors (e.g., file vanished between glob and read)
                content = f"--- Skipped reading file: Unexpected error - {type(e).__name__}: {e} ---"
                print(f"Skipping (read error - other): {relative_path} - {e}", file=sys.stderr)
                output_parts.append(header + content + footer)
                skipped_read_error_count += 1

    # Summary Footer
    summary = (
        f"\n--- Summary ---\n"
        f"Processed: {found_files_count} files.\n"
        f"Skipped (Extension): {skipped_extension_count} files.\n"
        f"Skipped (Size): {skipped_size_count} files.\n"
        f"Skipped (Read Error): {skipped_read_error_count} files.\n"
        f"Total items considered in '{folder_path.name}': {found_files_count + skipped_extension_count + skipped_size_count + skipped_read_error_count}\n"
        f"--- End Summary ---\n"
    )
    print(summary, file=sys.stderr)

    if not output_parts:
        return f"No files matching the criteria were found or could be read in {folder_path_str}."

    return "".join(output_parts)


def main():
    parser = argparse.ArgumentParser(
        description="""Reads specified text files from a folder (recursively by default)
                    and prints their relative paths and content as a single block
                    of text, suitable for pasting into an LLM chat window.""",
        formatter_class=argparse.RawTextHelpFormatter  # Preserve formatting in help
    )
    parser.add_argument(
        "folder_path",
        help="The path to the target folder."
    )
    parser.add_argument(
        "-nr", "--no-recursive",
        action="store_false",
        dest="recursive",
        # default=True is implicit because store_false means default is True
        help="Disable recursive search (only process files in the top-level folder)."
    )
    parser.add_argument(
        "-e", "--extensions",
        nargs='*',  # 0 or more arguments
        default=INCLUDED_EXTENSIONS,  # Use the default list from config
        help=f"""Space-separated list of file extensions to include
(e.g., .py .txt .md). Remember the leading dot!
If omitted, defaults to a predefined list: {', '.join(INCLUDED_EXTENSIONS) if INCLUDED_EXTENSIONS else 'None'}.
To include ALL files (potentially binary), provide an empty list like: -e
(Use with caution!)."""
    )
    parser.add_argument(
        "--max-size-mb",
        type=float,
        default=MAX_FILE_SIZE_BYTES / (1024 * 1024) if MAX_FILE_SIZE_BYTES else None,
        help=f"""Maximum file size in Megabytes (MB) to include.
Files larger than this will be skipped.
Default: {MAX_FILE_SIZE_BYTES / (1024 * 1024) if MAX_FILE_SIZE_BYTES else 'None (no limit)'} MB."""
    )

    args = parser.parse_args()

    # Process extensions input
    file_extensions = None
    if args.extensions is not None:  # Check if -e was provided at all
        if len(args.extensions) == 0:  # -e was provided with no arguments
            print("Extension filter disabled by user request (-e). Attempting to read all files.", file=sys.stderr)
            file_extensions = None  # Explicitly set to None for "all files" logic
        else:
            # Normalize: lowercase and ensure leading dot
            file_extensions = {
                ext.lower() if ext.startswith('.') else '.' + ext.lower()
                for ext in args.extensions
            }

    # Process max size
    max_size_bytes = None
    if args.max_size_mb is not None:
        max_size_bytes = int(args.max_size_mb * 1024 * 1024)
        if max_size_bytes < 0:
            print("Warning: --max-size-mb cannot be negative. Ignoring size limit.", file=sys.stderr)
            max_size_bytes = None

    result_string = read_files_to_string(
        args.folder_path,
        recursive=args.recursive,
        extensions=file_extensions,
        max_size=max_size_bytes
    )

    # Copy result to clipboard if pyperclip is available
    try:
        pyperclip.copy(result_string)
        print(">>> Result copied to clipboard. <<<", file=sys.stderr)
    except Exception as e:
        print(f">>> Warning: Could not copy to clipboard: {e} <<<", file=sys.stderr)
        print(">>> Please manually copy the text from the console. <<<", file=sys.stderr)

    # Print the final result to standard output
    # Add clear markers for easy copying
    print("\n" + "="*20 + " START OF CONSOLIDATED FILES " + "="*20)
    print(result_string)
    print("="*21 + " END OF CONSOLIDATED FILES " + "="*21 + "\n")
    print(">>> Copy the text between the START and END markers above. <<<", file=sys.stderr)
    print(">>> Diagnostic messages were printed above this line (to stderr). <<<", file=sys.stderr)


if __name__ == "__main__":
    main()