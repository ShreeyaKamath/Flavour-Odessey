from __future__ import annotations

import json
import sys
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_ROOT = REPO_ROOT / "backend"

if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app.main import create_app  # noqa: E402


def main() -> None:
    output_path = REPO_ROOT / "shared" / "openapi" / "openapi.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)

    app = create_app()
    output_path.write_text(
        json.dumps(app.openapi(), indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {output_path.relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()
