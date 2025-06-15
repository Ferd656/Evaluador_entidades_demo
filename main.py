import os
import json
import pandas as pd
import tkinter as tk
from openai import OpenAI
from tkinter import filedialog

MODELO = "gpt-4o" # Generative Pre-trained Transformer Omni versión 4

root = tk.Tk()
root.withdraw()
root.attributes('-topmost', True)

client = OpenAI(
    api_key=os.getenv("CLAVE_DE_FER")
)

file_path = filedialog.askopenfilename(
    title="Selecciona el insumo de emisores",
    filetypes=[("Text files", "*.txt"), ("All files", "*.*")]
)
root.attributes('-topmost', False) 
if not os.path.isfile(file_path):
    print("No se seleccionó un archivo válido. Terminando el programa.")
    exit()

with open("file_selected.flag", "w") as f:
    f.write("1")

df = pd.read_csv(file_path, delimiter="\t", encoding="utf-8")
names = df["Emisor"]
subjects_str = "\n".join([f"Subject {i+1}: {name}" for i, name in enumerate(names)])

try:
    with open('c', 'r', encoding='utf-8') as f:
        core = f.read()
except Exception as e:
    print(f"Error al leer el archivo 'c': {e}")
finally:
    os.remove("file_selected.flag")
    if not core:
        print("No se pudo leer el contenido del archivo 'c'. Terminando el programa.")
        exit()

messages = [
    {"role": "user", "content": core + subjects_str
    }
]

response = client.chat.completions.create(
    model=MODELO,
    messages=messages
)

assistant_reply = response.choices[0].message.content
messages.append({"role": "assistant", "content": assistant_reply})

messages.append({"role": "user", "content": "para cada sujeto, puedes añadir los componentes que consideres necesarios, pero no te limites a los que ya he mencionado. Si crees que hay otros componentes importantes, añádelos."})

followup_response = client.chat.completions.create(
    model=MODELO,
    messages=messages
)

followup_reply = followup_response.choices[0].message.content
messages.append({"role": "assistant", "content": followup_reply})

messages.append({"role": "user", "content": "Para cada sujeto con 'componentes': 'NA' inténtalo de nuevo, puedes basarte en noticias del periodo en cuestión"})

followup_response = client.chat.completions.create(
    model=MODELO,
    messages=messages
)

os.remove("file_selected.flag")

def clean_json_string(s):
    lines = s.splitlines()
    cleaned = []
    in_code_fence = False
    for line in lines:
        if line.strip().startswith("```"):
            in_code_fence = not in_code_fence
            continue
        if line.strip().startswith("//"):
            continue
        if not in_code_fence:
            cleaned.append(line)
    return "\n".join(cleaned)

with open("output.json", "w", encoding="utf-8") as f:
    f.write(followup_response.choices[0].message.content.replace("```json", "").replace("```", ""))

print("Listo!")

