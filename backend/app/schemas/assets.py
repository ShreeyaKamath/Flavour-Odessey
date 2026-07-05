from app.models.enums import AssetManifestType
from app.schemas.common import TimestampedRead


class AssetManifestRead(TimestampedRead):
    manifest_type: AssetManifestType
    asset_key: str
    path: str
    extra: dict
