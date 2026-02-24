# backend/benchmarking.py

import time
import psutil
import os

def start_benchmark():
    """
    Captures start time and memory usage.
    """
    process = psutil.Process(os.getpid())
    return {
        "start_time": time.time(),
        "memory_before": process.memory_info().rss / (1024 * 1024)
    }

def end_benchmark(start_data):
    """
    Calculates latency and memory usage.
    """
    process = psutil.Process(os.getpid())
    latency = round(time.time() - start_data["start_time"], 2)
    memory_after = process.memory_info().rss / (1024 * 1024)
    memory_used = round(memory_after - start_data["memory_before"], 2)

    return {
        "latency_seconds": latency,
        "memory_used_mb": memory_used
    }