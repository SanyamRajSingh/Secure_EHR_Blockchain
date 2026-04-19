import os
import re
import glob

# Paths to search
jsx_files = glob.glob('frontend/ehr-frontend/src/**/*.jsx', recursive=True)

replacements = [
    (r'\btext-gray-[789]00\b', 'text-[color:var(--text-primary)]'),
    (r'\btext-gray-[456]00\b', 'text-[color:var(--text-secondary)]'),
    (r'\bbg-white\b', 'bg-[color:var(--bg-card)]'),
    (r'\bbg-gray-50\b', 'bg-[color:var(--bg-secondary)]'),
    (r'\bbg-gray-100\b', 'bg-[color:var(--bg-secondary)]'),
    (r'\bborder-gray-[123]00\b', 'border-[color:var(--border-color)]'),
    (r'\bbg-blue-50\b', 'bg-[color:var(--bg-secondary)]'),
    (r'\btext-blue-800\b', 'text-[color:var(--accent-primary)]'),
    (r'\btext-green-800\b', 'text-[color:var(--text-primary)]'),
    (r'\bbg-green-100\b', 'bg-[color:var(--bg-secondary)]'),
]

for file_path in jsx_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content
    for pattern, repl in replacements:
        new_content = re.sub(pattern, repl, new_content)

    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file_path}")
