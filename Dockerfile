# Use a slim Python image (Debian-based as recommended by LiveKit)
FROM python:3.11-slim

# Install system dependencies for audio and networking
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user for Hugging Face security
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

WORKDIR $HOME/app

# Copy requirements first to leverage Docker cache
COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your agent code
COPY --chown=user . .

# Expose the port Hugging Face expects (7860)
EXPOSE 7860

# Run the agent (this matches the logic in your agent.py)
CMD ["python", "agent.py", "dev"]