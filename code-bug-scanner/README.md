# Code Bug Scanner

A small FastAPI service that checks a code snippet for bugs. For Python it first runs a fast local `ast` syntax check, then asks Gemini for a structured bug report.

## Run

```bash
cd code-bug-scanner
pip install -r requirements.txt
export GEMINI_API_KEY=your-key
uvicorn main:app --reload
```

Optional environment variables:

| Variable | Default | Purpose |
| --- | --- | --- |
| `GEMINI_MODEL` | `gemini-3.5-flash` | Model used for analysis |
| `ALLOWED_ORIGINS` | `*` | Comma-separated CORS origins, e.g. `https://migabuilder.com` |
| `MAX_CODE_CHARS` | `50000` | Largest snippet accepted |

## API

`POST /scan`

```json
{ "code": "def f(x):\n    return x / 0", "language": "python" }
```

Response:

```json
{
  "language": "python",
  "has_syntax_error": false,
  "ast_error_details": null,
  "bugs": [
    {
      "line_number": 2,
      "severity": "HIGH",
      "bug_type": "Logic Error",
      "description": "Always raises ZeroDivisionError.",
      "suggested_fix": "return x / divisor  # guard divisor != 0"
    }
  ],
  "clean_code_score": 30
}
```

`GET /health` returns `{"status": "ok"}`.
