"""
Simple test script to verify the API is working correctly.
Run this after starting the backend server.
"""

import requests
import json


def test_health_check():
    """Test the health check endpoint."""
    print("Testing health check endpoint...")
    try:
        response = requests.get("http://localhost:8000/api/health")
        print(f"✓ Health check status: {response.status_code}")
        print(f"  Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"✗ Health check failed: {e}")
        return False


def test_dataset_summary():
    """Test the dataset summary endpoint."""
    print("\nTesting dataset summary endpoint...")
    try:
        response = requests.get("http://localhost:8000/api/dataset/summary")
        print(f"✓ Dataset summary status: {response.status_code}")
        data = response.json()
        print(f"  Total papers: {data['metadata']['total_papers']}")
        print(f"  Total fields: {data['metadata']['total_fields']}")
        print(f"  Available fields: {', '.join(data['available_fields'][:5])}...")
        return response.status_code == 200
    except Exception as e:
        print(f"✗ Dataset summary failed: {e}")
        return False


def test_chat_query():
    """Test the chat endpoint with a sample query."""
    print("\nTesting chat endpoint...")
    try:
        query = "How many papers in biology implement AI?"
        print(f"  Query: {query}")

        response = requests.post(
            "http://localhost:8000/api/chat",
            json={
                "message": query,
                "conversation_history": []
            },
            timeout=60
        )

        print(f"✓ Chat query status: {response.status_code}")
        data = response.json()
        print(f"  Response preview: {data['response'][:200]}...")
        return response.status_code == 200
    except Exception as e:
        print(f"✗ Chat query failed: {e}")
        return False


def main():
    """Run all tests."""
    print("=" * 60)
    print("Research Paper Dataset API - Test Suite")
    print("=" * 60)

    # Test health check
    health_ok = test_health_check()

    # Test dataset summary
    summary_ok = test_dataset_summary()

    # Test chat query
    chat_ok = test_chat_query()

    # Summary
    print("\n" + "=" * 60)
    print("Test Results:")
    print("=" * 60)
    print(f"Health Check: {'✓ PASS' if health_ok else '✗ FAIL'}")
    print(f"Dataset Summary: {'✓ PASS' if summary_ok else '✗ FAIL'}")
    print(f"Chat Query: {'✓ PASS' if chat_ok else '✗ FAIL'}")

    if all([health_ok, summary_ok, chat_ok]):
        print("\n✓ All tests passed! Your API is ready to use.")
    else:
        print("\n✗ Some tests failed. Please check the error messages above.")


if __name__ == "__main__":
    main()
