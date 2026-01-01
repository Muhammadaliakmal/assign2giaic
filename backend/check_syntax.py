import ast
import os
import sys

def check_syntax(path):
    print(f"Checking {path}...")
    try:
        with open(path, "r", encoding="utf-8") as f:
            source = f.read()
        ast.parse(source)
        print("OK")
    except Exception as e:
        print(f"ERROR: {e}")
        sys.exit(1)

for root, dirs, files in os.walk("."):
    for file in files:
        if file.endswith(".py"):
            check_syntax(os.path.join(root, file))
