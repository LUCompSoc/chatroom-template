import uuid
from uuid import UUID

from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# We can use FastAPI to host a website at the endpoint 'chatroom'.
app.mount("/chatroom", StaticFiles(directory="./frontend", html=True), name="chatroom")

# A function for generating a unique ID for a message.
def create_id():
    return uuid.uuid1()

@app.get("/messages/recent")
async def get_last_message_ids(limit: int = 10):
    # TODO: Here we want to return an array of the most recent messages, up to the limit.
    pass

@app.get("/messages/{message_id}")
async def get_message(message_id: UUID):
    # TODO: Here we want to return the message with the specified ID.
    pass

@app.post("/messages")
async def send_message(request: Request):
    # This function is laid out a bit differently because the message text is
    # in the body of the request rather than the URL.
    message_text = (await request.body()).decode("utf-8")

    # TODO: Use the create_id function and the value of message_text to
    # store a message with a unique ID.

@app.delete("/messages/{message_id}")
async def delete_message(message_id: UUID):
    # TODO: Remove the message with the specified ID.
    pass

