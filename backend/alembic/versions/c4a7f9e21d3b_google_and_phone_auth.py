"""google and phone auth

Revision ID: c4a7f9e21d3b
Revises: b16c225056f8
Create Date: 2026-08-21 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c4a7f9e21d3b'
down_revision: Union[str, Sequence[str], None] = 'b16c225056f8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Google sign-in never sets a password, and phone-only sign-up never
    # collects an email — both columns have to become optional.
    op.alter_column('children', 'password_hash', existing_type=sa.String(), nullable=True)
    op.alter_column('children', 'email', existing_type=sa.String(), nullable=True)

    op.add_column('children', sa.Column('mobile_verified', sa.Boolean(), nullable=True, server_default=sa.false()))
    op.add_column('children', sa.Column('google_id', sa.String(), nullable=True))
    op.create_unique_constraint('uq_children_google_id', 'children', ['google_id'])
    # `mobile` already existed but had no uniqueness constraint — phone auth
    # needs one so the same number can't back two accounts.
    op.create_unique_constraint('uq_children_mobile', 'children', ['mobile'])


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint('uq_children_mobile', 'children', type_='unique')
    op.drop_constraint('uq_children_google_id', 'children', type_='unique')
    op.drop_column('children', 'google_id')
    op.drop_column('children', 'mobile_verified')
    op.alter_column('children', 'email', existing_type=sa.String(), nullable=False)
    op.alter_column('children', 'password_hash', existing_type=sa.String(), nullable=False)
