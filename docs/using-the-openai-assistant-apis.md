## Documentation for OpenAI Assistant API

### Overview
This documentation provides the necessary steps to interact with the OpenAI Assistant API, focusing on creating threads, sending messages, and fetching responses in a concise manner.

### Prerequisites
- An OpenAI API key
- js app with `openai` npm package installed

### Steps to Interact with the API

#### 1. Create a Thread
To start a session, create a thread using the following API endpoint.

**CURL Command:**
```bash
curl --location 'https://api.openai.com/v1/threads' \
--header 'Authorization: Bearer <OPEN_AI_API_KEY>' \
--header 'OpenAI-Beta: assistants=v2' \
--header 'Content-Type: application/json' \
--data '[]'
```

```javascript
openai.beta.threads.create();
```

**Response Example:**
```json
{
    "id": "thread_xyz",
    "object": "thread",
    "created_at": 1716131800
}
```

#### 2. Send a Message
Once a thread is created, use its ID to send messages.

**CURL Command:**
```bash
curl --location 'https://api.openai.com/v1/threads/<THREAD_ID>/messages' \
--header 'Authorization: Bearer <OPEN_AI_API_KEY>' \
--header 'Content-Type: application/json' \
--data '{"role": "user", "content": "Where were you born?"}'
```

```javascript
openai.beta.threads.messages.create(thread.id, {
  role: "user",
  content: "Where were you born?"
});
```

**Response Example:**
```json
{
    "id": "msg_xyz",
    "object": "thread.message",
    "created_at": 1716132167,
    "role": "user",
    "content": [{"type": "text", "text": {"value": "Where were you born?"}}]
}
```

#### 3. Retrieve Assistant's Response
To get the assistant's response, run the thread.

**CURL Command:**
```bash
curl https://api.openai.com/v1/threads/<THREAD_ID>/runs \
-H "Authorization: Bearer <OPEN_AI_API_KEY>" \
-H "Content-Type: application/json" \
-d '{"assistant_id": "<ASSISTANT_ID>"}'
```

```javascript
openai.beta.threads.runs.createAndPoll(thread.id, {
  assistant_id: "asst_sample"
});
```

**Response Example:**
```json
{
    "id": "run_xyz",
    "object": "thread.run",
    "created_at": 1716133076,
    "status": "queued"
}
```

#### 4. List Messages
After running the thread, list messages to see all interactions.

**CURL Command:**
```bash
curl https://api.openai.com/v1/threads/<THREAD_ID>/messages \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <OPEN_AI_API_KEY>"
```

```javascript
openai.beta.threads.messages.list(thread.id);
```

**Response Example:**
```json
{
    "object": "list",
    "data": [
        {
            "id": "msg_abc",
            "role": "assistant",
            "content": [{"type": "text", "text": {"value": "Response from assistant"}}],
            "created_at": 1716133077
        }
    ]
}
```

