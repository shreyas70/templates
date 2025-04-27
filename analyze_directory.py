#!/usr/bin/env python3

import os
import argparse
import sys

# --- Configuration ---

# Standard directories to exclude (case-sensitive, add more as needed)
# These are basenames, not full paths.
DEFAULT_EXCLUDED_DIRS = {
    "node_modules", ".git", ".svn", "__pycache__", "venv", ".venv", "env",
    ".env", # Often contains secrets, might want to include with -i .env if needed
    "dist", "build", "out", "target", "*.egg-info", ".vscode", ".idea",
    "vendor", "site-packages", ".terraform", ".serverless", "coverage",
    "logs", "temp", "tmp",".ruff_cache"
    # Add any other project-specific build/dependency directories
}

# Exclude common binary/non-code file extensions (lowercase)
# Add or remove extensions as needed for your project types
EXCLUDED_EXTENSIONS = {
    # Common data/text formats potentially not considered 'code'
    '.csv', '.json', '.yaml', '.yml', '.xml','.txt', '.md', '.rst',
    # Binaries/Archives/Media/Docs/Fonts etc.
    '.bin', '.dat', '.db', '.sqlite', '.sqlite3',
    '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.ico', '.tif', '.tiff', '.webp', '.svg',
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.odt', '.ods', '.odp',
    '.zip', '.tar', '.gz', '.bz2', '.rar', '.7z', '.jar', '.war',
    '.mp3', '.wav', '.ogg', '.flac', '.mp4', '.avi', '.mov', '.wmv', '.mkv', '.webm',
    '.exe', '.dll', '.so', '.dylib', '.pyc', '.pyo', '.o', '.a', '.obj', '.class',
    '.lock', '.sum',
    '.ttf', '.otf', '.woff', '.woff2',
    '.log',
}

# Set for exact filenames to exclude (case-insensitive check)
DEFAULT_EXCLUDED_FILENAMES = {
    '.ds_store',      # macOS metadata
    'thumbs.db',      # Windows thumbnail cache
    'desktop.ini',    # Windows folder config
    '.env',           # Often contains secrets, exclude by default
    # Add others like 'config.bak', '.mypy_cache', etc. if needed
}


# --- Tokenizer Setup ---
try:
    import tiktoken
    # Use a common encoding model (cl100k_base is used by GPT-3.5/4)
    encoding = tiktoken.get_encoding("cl100k_base")
    TOKENIZER_METHOD = "tiktoken (cl100k_base)"
    print(f"Using tokenizer: {TOKENIZER_METHOD}", file=sys.stderr)

    def count_file_tokens(content):
        """Counts tokens using tiktoken, with basic size check."""
        # Basic safeguard against extremely large files crashing tiktoken
        MAX_CONTENT_SIZE_BYTES = 50 * 1024 * 1024 # 50 MB limit example
        if sys.getsizeof(content) > MAX_CONTENT_SIZE_BYTES:
             print(f"Warning: Content size exceeds limit ({MAX_CONTENT_SIZE_BYTES} bytes) for {TOKENIZER_METHOD}, skipping.", file=sys.stderr)
             return 0
        try:
            # Using encode_ordinary to avoid special token processing if not needed
            # For pure counting, encode() is also fine.
            tokens = encoding.encode(content, disallowed_special=())
            return len(tokens)
        except Exception as e:
            # Catch potential errors during encoding (e.g., unusual characters/formats)
            print(f"Warning: tiktoken encoding failed: {e}", file=sys.stderr)
            return 0

except ImportError:
    TOKENIZER_METHOD = "simple whitespace split"
    print("Warning: 'tiktoken' library not found.", file=sys.stderr)
    print("Falling back to simple word count (splitting by whitespace).", file=sys.stderr)
    print("Install tiktoken for more accurate counts: pip install tiktoken", file=sys.stderr)

    def count_file_tokens(content):
        """Fallback token counter using simple whitespace split."""
        return len(content.split())

# --- Functions ---

def check_token_count(file_path):
    """Reads a file and counts its tokens, handling potential errors."""
    try:
        # Read with utf-8, ignore errors for potentially mixed/bad encodings
        # Increased buffer size slightly for potentially large files
        with open(file_path, 'r', encoding='utf-8', errors='ignore', buffering=8192*4) as f:
            content = f.read()
        return count_file_tokens(content)
    except FileNotFoundError:
        # This can happen if file is deleted during scan, usually safe to ignore
        # print(f"Warning: File not found during count: {file_path}", file=sys.stderr)
        return 0
    except PermissionError:
        print(f"Warning: Permission denied reading file: {file_path}", file=sys.stderr)
        return 0
    except MemoryError:
         print(f"Warning: MemoryError reading file (likely very large): {file_path}", file=sys.stderr)
         return 0
    except OSError as e:
         # Catch other OS errors like file too large on some systems
         print(f"Warning: OS error reading file {file_path}: {e}", file=sys.stderr)
         return 0
    except Exception as e:
        # Generic catch-all for unexpected issues during read/count
        print(f"Warning: Error processing file {file_path}: {e}", file=sys.stderr)
        return 0

def is_excluded_dir(dir_name, excluded_dir_set):
    """Checks if a directory name should be excluded."""
    if dir_name in excluded_dir_set:
        return True
    # Handle suffix check, e.g., for '*.egg-info'
    if "*.egg-info" in excluded_dir_set and dir_name.endswith(".egg-info"):
        return True
    # Add more complex matching logic here if needed (e.g., regex)
    return False

def is_excluded_file(file_name, excluded_extension_set, excluded_filename_set):
    """Checks if a file should be excluded based on exact filename OR extension."""
    try:
        # Check 1: Exact filename match (case-insensitive)
        if file_name.lower() in excluded_filename_set:
            return True

        # Check 2: Extension match (case-insensitive)
        _ , ext = os.path.splitext(file_name)
        # Proceed only if an actual extension exists (ignore '')
        if ext and ext.lower() in excluded_extension_set:
             return True

    except Exception as e: # Handle potential weird filenames
        print(f"Warning: Could not process filename '{file_name}' for exclusion: {e}", file=sys.stderr)
        return True # Exclude if error occurs during check

    return False # Not excluded by either check


# --- Main Execution ---
def main():
    parser = argparse.ArgumentParser(
        description="List files and count tokens, excluding standard dirs, files, and extensions. Shows top 5 files by token count.",
        formatter_class=argparse.RawTextHelpFormatter
    )
    parser.add_argument(
        "root_dir",
        help="The root directory to scan."
    )
    parser.add_argument(
        "-e", "--exclude-dir",
        action="append", default=[],
        help="Exclude directories by basename (e.g., 'docs'). Can use multiple times."
    )
    parser.add_argument(
        "-i", "--include-dir",
        action="append", default=[],
        help="Include directories previously excluded by default (e.g., '.env')."
    )
    parser.add_argument(
        "--exclude-ext",
        action="append", default=[],
        help="Exclude file extensions (e.g., '.log'). Case-insensitive."
    )
    parser.add_argument(
        "--include-ext",
        action="append", default=[],
        help="Include extensions previously excluded by default/user (e.g., '.json')."
    )
    parser.add_argument(
        "--exclude-file",
        action="append", default=[],
        help="Exclude specific filenames (e.g., 'config.bak'). Case-insensitive."
    )
    parser.add_argument(
        "--include-file",
        action="append", default=[],
        help="Include specific filenames previously excluded by default/user (e.g., '.env')."
    )
    parser.add_argument(
        "-q", "--quiet",
        action="store_true",
        help="Suppress printing the main list of files found, only show top 5 and summary."
    )
    parser.add_argument(
        "--show-excluded-dirs",
        action="store_true",
        help="Print the full paths of directories that were skipped due to exclusion rules."
    )
    parser.add_argument(
        "--sort-by",
        choices=['path', 'tokens'], default='path',
        help="Sort the main output file list by 'path' (alphabetical, default) or 'tokens' (descending)."
    )
    parser.add_argument(
        "--max-list",
        type=int, default=1000,
        help="Maximum number of files to print in the main list (default: 1000)."
    )


    args = parser.parse_args()

    if not os.path.isdir(args.root_dir):
        print(f"Error: Root directory '{args.root_dir}' not found or is not a directory.", file=sys.stderr)
        sys.exit(1)

    # --- Setup Exclusions ---
    current_excluded_dirs = DEFAULT_EXCLUDED_DIRS.copy()
    current_excluded_dirs.update(args.exclude_dir)
    for d in args.include_dir: current_excluded_dirs.discard(d) # Use discard to avoid error if not present

    current_excluded_extensions = EXCLUDED_EXTENSIONS.copy()
    current_excluded_extensions.update(ext.lower() for ext in args.exclude_ext)
    for ext in args.include_ext: current_excluded_extensions.discard(ext.lower())

    current_excluded_filenames = DEFAULT_EXCLUDED_FILENAMES.copy()
    current_excluded_filenames.update(fname.lower() for fname in args.exclude_file)
    for fname in args.include_file: current_excluded_filenames.discard(fname.lower())

    # --- Print Configuration ---
    print("--- Scan Configuration ---", file=sys.stderr)
    print(f"Root Directory: {os.path.abspath(args.root_dir)}", file=sys.stderr)
    print(f"Excluded Directory Basenames: {sorted(list(current_excluded_dirs))}", file=sys.stderr)
    print(f"Excluded Filenames: {sorted(list(current_excluded_filenames))}", file=sys.stderr)
    print(f"Excluded File Extensions: {sorted(list(current_excluded_extensions))}", file=sys.stderr)
    print(f"Tokenizer Method: {TOKENIZER_METHOD}", file=sys.stderr)
    print(f"Sort main list by: {args.sort_by}", file=sys.stderr)
    print("--- Starting Scan ---", file=sys.stderr)

    # Store results as tuples: (filepath, token_count)
    file_results = []
    total_tokens = 0
    processed_files_count = 0
    skipped_dirs_count = 0
    excluded_dir_paths_log = [] # Store full paths if requested for logging

    # --- Recursive Walk ---
    for dirpath, dirnames, filenames in os.walk(args.root_dir, topdown=True, followlinks=False):

        # --- Directory Exclusion ---
        original_dirnames = list(dirnames) # Iterate over copy
        dirnames.clear() # Modify original list in-place

        for d in original_dirnames:
            if is_excluded_dir(d, current_excluded_dirs):
                skipped_dirs_count += 1
                if args.show_excluded_dirs:
                   excluded_dir_paths_log.append(os.path.join(dirpath, d))
            else:
                # Only add back directories that are NOT excluded
                dirnames.append(d)

        # --- File Processing ---
        for filename in filenames:
            # Check file exclusion (uses both filename and extension sets)
            if is_excluded_file(filename, current_excluded_extensions, current_excluded_filenames):
                continue

            processed_files_count += 1
            file_path = os.path.join(dirpath, filename)

            # Count tokens for the current file
            count = check_token_count(file_path)

            # Append tuple (filepath, count) to results list
            file_results.append((file_path, count))

            # Accumulate total tokens
            total_tokens += count # Adds 0 if count failed or was 0

    # --- Output Results ---
    print("\n--- Scan Results ---")

    # Sort results for the main list based on user choice
    if args.sort_by == 'tokens':
        # Sort by token count (index 1), descending
        sorted_main_list = sorted(file_results, key=lambda x: x[1], reverse=True)
    else:
        # Default: Sort by file path (index 0), ascending
        sorted_main_list = sorted(file_results, key=lambda x: x[0])


    # --- Print the main file list (if not quiet) ---
    if not args.quiet:
        print(f"\nFound {len(sorted_main_list):,} files matching criteria (sorted by {args.sort_by}):")
        if sorted_main_list:
            max_files_to_print = args.max_list
            files_printed_count = 0
            for i, (f_path, f_count) in enumerate(sorted_main_list):
                 if i < max_files_to_print:
                     # Format and print the file path with its token count (comma formatted)
                     print(f"- {f_path} ({f_count:,} tokens)")
                     files_printed_count += 1
                 elif i == max_files_to_print:
                     # Only print truncation message if there are actually more files
                     if len(sorted_main_list) > max_files_to_print:
                         print(f"- ... (list truncated at {max_files_to_print} files)")
                     break
            # Optional: print count if list wasn't truncated
            # if files_printed_count == len(sorted_main_list):
            #    print(f"(Displayed all {files_printed_count:,} files)")
        else:
            print("(No files found matching criteria)")

    # --- Print Top 5 Files by Token Count ---
    if file_results: # Only proceed if there are results
        # Sort specifically for this section: by token count (descending)
        # No need to re-sort if already sorted by tokens, but safe to do so
        top_files_sorted = sorted(file_results, key=lambda x: x[1], reverse=True)

        print("\n--- Top 5 Files by Token Count ---")
        # Determine how many top files to show (max 5)
        num_top_files = min(5, len(top_files_sorted))

        if num_top_files > 0:
            # Only show files with more than 0 tokens in top list if desired
            # top_files_with_tokens = [res for res in top_files_sorted if res[1] > 0][:num_top_files]
            # for i, (f_path, f_count) in enumerate(top_files_with_tokens): # Use this line instead if you only want >0 tokens

            # Print top N files regardless of count (unless count was an error == 0)
            for i in range(num_top_files):
                f_path, f_count = top_files_sorted[i]
                # Optional check: skip if count is 0 AND it wasn't just an empty file
                # if f_count == 0 and os.path.exists(f_path) and os.path.getsize(f_path) > 0: continue
                print(f"{i+1}. {f_path} ({f_count:,} tokens)")
        else:
            # This case should technically not happen if file_results is not empty,
            # but included for completeness.
            print("(No files found or processed)")
    elif not args.quiet:
         # If file_results is empty and not quiet, mention no files found here too.
         print("\n--- Top 5 Files by Token Count ---")
         print("(No files found matching criteria)")


    # --- Optionally print skipped directories ---
    if args.show_excluded_dirs and excluded_dir_paths_log:
        print(f"\n--- Skipped Directories ({len(excluded_dir_paths_log)}) ---")
        max_dirs_to_print = 100
        excluded_dir_paths_log.sort() # Sort for consistent output
        for i, d_path in enumerate(excluded_dir_paths_log):
            if i < max_dirs_to_print:
                print(f"- {d_path}")
            elif i == max_dirs_to_print:
                if len(excluded_dir_paths_log) > max_dirs_to_print:
                    print(f"- ... (list truncated at {max_dirs_to_print} directories)")
                break

    # --- Print Summary ---
    print("\n--- Summary ---")
    print(f"Total Files Found Matching Criteria: {len(file_results):,}")
    print(f"Total Directories Skipped by Exclusion Rules: {skipped_dirs_count:,}")
    # total_tokens is accumulated during the walk
    print(f"Total Tokens Counted ({TOKENIZER_METHOD}): {total_tokens:,}")
    print("----------------")

if __name__ == "__main__":
    main()