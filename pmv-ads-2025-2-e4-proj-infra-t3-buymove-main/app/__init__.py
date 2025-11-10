"""Compatibility package exposing the backend FastAPI app as ``app``.

This allows running ``uvicorn app.main:app`` from the repository root by
pointing the ``app`` namespace at the backend source tree located in
``src/backend/app``.
"""

from __future__ import annotations

from pathlib import Path

_backend_package_path = (
    Path(__file__).resolve().parent.parent / "src" / "backend" / "app"
)

if not _backend_package_path.is_dir():
    raise ImportError(
        "Backend package not found at expected location: "
        f"{_backend_package_path!s}"
    )

__path__ = [str(_backend_package_path)]
