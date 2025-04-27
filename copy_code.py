import os
import pyperclip
import tiktoken
import argparse

# Configuration (copied from original codebase)
DEFAULT_EXCLUDED_DIRS = {
    "node_modules", ".git", ".svn", "__pycache__", "venv", ".venv", "env",
    ".env", "dist", "build", "out", "target", "*.egg-info", ".vscode", ".idea",
    "vendor", "site-packages", ".terraform", ".serverless", "coverage",
    "logs", "temp", "tmp",".ruff_cache",".pytest_cache","__mocks__", "docs", "web"
}

EXCLUDED_EXTENSIONS = {
    '.csv', '.json', '.yaml', '.yml', '.xml', '.txt', '.md', '.rst',
    '.bin', '.dat', '.db', '.sqlite', '.sqlite3',
    '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.ico', '.tif', '.tiff', '.webp', '.svg',
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.odt', '.ods', '.odp',
    '.zip', '.tar', '.gz', '.bz2', '.rar', '.7z', '.jar', '.war',
    '.mp3', '.wav', '.ogg', '.flac', '.mp4', '.avi', '.mov', '.wmv', '.mkv', '.webm',
    '.exe', '.dll', '.so', '.dylib', '.pyc', '.pyo', '.o', '.a', '.obj', '.class',
    '.lock', '.sum', '.icns', '.ttf', '.otf', '.woff', '.woff2', '.log',
}

DEFAULT_EXCLUDED_FILENAMES = {
    '.ds_store', 'thumbs.db', 'desktop.ini', '.env', '.coverage','__init__.py', 'LICENSE', 'CHANGELOG'
}

encoding = tiktoken.get_encoding("cl100k_base")

def count_tokens(text: str) -> int:
    return len(encoding.encode(text, disallowed_special=()))

def collect_code_snippets(root_dir: str = ".") -> tuple[str, list[str]]:
    collected_contents = []
    included_files = []

    for dirpath, dirnames, filenames in os.walk(root_dir):
        dirnames[:] = [d for d in dirnames if d not in DEFAULT_EXCLUDED_DIRS and not ("*.egg-info" in DEFAULT_EXCLUDED_DIRS and d.endswith(".egg-info"))]

        for filename in filenames:
            ext = os.path.splitext(filename)[1].lower()
            if filename.lower() in DEFAULT_EXCLUDED_FILENAMES or (ext and ext.lower() in EXCLUDED_EXTENSIONS):
                continue

            file_path = os.path.join(dirpath, filename)
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    relative_path = os.path.relpath(file_path, root_dir)
                    collected_contents.append(f"\n\n# FILE: {relative_path}\n\n{content}")
                    included_files.append(relative_path)
            except Exception as e:
                print(f"Could not read {file_path}: {e}")

    return "\n".join(collected_contents), included_files


def main():
    parser = argparse.ArgumentParser(
        description="Collect code snippets from a directory and copy to clipboard, excluding standard dirs and files."
    )
    parser.add_argument(
        "root_dir",
        help="The root directory to scan.",
        default=".",
        nargs="?"
    )

    args = parser.parse_args()

    if not os.path.isdir(args.root_dir):
        print(f"Error: Root directory '{args.root_dir}' not found or is not a directory.")
        return

    code_blob, included_files = collect_code_snippets(args.root_dir)
    pyperclip.copy(code_blob)
    print("\n📁 Included files and folders:")
    for f in included_files:
        print(f"- {f}")
    print("✅ All code copied to clipboard with relative paths for LLM input.")
    print(f"🔢 Total token count (cl100k_base): {count_tokens(code_blob):,} tokens")
    
    


if __name__ == "__main__":
    main()
