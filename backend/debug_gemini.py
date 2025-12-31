
import google.generativeai as genai
from google.generativeai.types import Tool
import os
from datetime import datetime

# Mock dependency
def add_task(user_id, title, description, session):
    return {"status": "ok"}

# Setup
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    # Try reading from .env manually just in case
    try:
        with open(".env") as f:
            for line in f:
                if line.startswith("GEMINI_API_KEY="):
                    api_key = line.split("=", 1)[1].strip()
                    break
    except:
        pass

if not api_key:
    print("No API Key found")
    exit(1)

genai.configure(api_key=api_key)

# Mock context
user_id = 1
session = None

# Local functions
def tool_add_task(title: str, description: str = ""):
    """Create a new task with a title and optional description."""
    return add_task(user_id, title, description, session)

current_tools = [tool_add_task]

print(" Attempt 1: Passing list of functions directly")
try:
    model = genai.GenerativeModel(
        model_name='gemini-1.5-flash',
        tools=current_tools
    )
    print("  Success: model created")
except Exception as e:
    print(f"  Fail: {e}")

print("\n Attempt 2: Wrapping in Tool object")
try:
    tool_object = Tool(function_declarations=current_tools)
    model = genai.GenerativeModel(
        model_name='gemini-1.5-flash',
        tools=[tool_object]
    )
    print("  Success: model created")
except Exception as e:
    print(f"  Fail: {e}")
