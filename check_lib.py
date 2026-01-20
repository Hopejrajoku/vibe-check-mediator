from livekit.agents import llm
import inspect

print(f"Checking livekit.agents.llm...")
attributes = dir(llm)

if "FunctionContext" in attributes:
    print("✅ Found 'FunctionContext' in llm")
else:
    print("❌ 'FunctionContext' NOT in llm directly.")
    print("Searching sub-attributes...")
    for attr in attributes:
        if not attr.startswith("_"):
            print(f" - Found: llm.{attr}")

# This will tell us the exact version for sure
try:
    import livekit.agents as agents
    print(f"\nExact SDK Version: {agents.__version__}")
except:
    print("\nCould not find version attribute.")