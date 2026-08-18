import os
from livekit import api
from dotenv import load_dotenv

load_dotenv()

def generate_token(room_name: str, participant_name: str) -> str:
    token = api.AccessToken(
        os.getenv("LIVEKIT_API_KEY"),
        os.getenv("LIVEKIT_API_SECRET")
    )
    token.with_identity(participant_name)
    token.with_name(participant_name)
    token.with_grants(
        api.VideoGrants(
            room_join=True,
            room=room_name,
        )
    )
    return token.to_jwt()

if __name__ == "__main__":
    token = generate_token("joshna-twin", "visitor")
    print(f"Token: {token}")
