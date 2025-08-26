# KODEON Concurrency API Documentation

This document describes the API for KODEON's concurrency features.

## Mutex Functions

### create_mutex()

Creates a new mutex.

**Syntax:**

```kodeon
var mutex = create_mutex()
```

**Returns:** A new mutex object.

### lock_mutex(mutex)

Acquires the lock on a mutex. If the mutex is already locked, the calling goroutine will block until the lock is available.

**Syntax:**

```kodeon
lock_mutex(mutex)
```

**Parameters:**

- `mutex`: The mutex to lock.

### unlock_mutex(mutex)

Releases the lock on a mutex.

**Syntax:**

```kodeon
unlock_mutex(mutex)
```

**Parameters:**

- `mutex`: The mutex to unlock.

## Condition Variable Functions

### create_condition()

Creates a new condition variable.

**Syntax:**

```kodeon
var condition = create_condition()
```

**Returns:** A new condition variable object.

### wait_condition(condition, mutex)

Waits on a condition variable. The mutex must be locked before calling this function. The mutex will be unlocked while waiting and re-locked before returning.

**Syntax:**

```kodeon
wait_condition(condition, mutex)
```

**Parameters:**

- `condition`: The condition variable to wait on.
- `mutex`: The mutex associated with the condition variable.

### signal_condition(condition)

Signals a condition variable, waking up one goroutine that is waiting on it.

**Syntax:**

```kodeon
signal_condition(condition)
```

**Parameters:**

- `condition`: The condition variable to signal.

### broadcast_condition(condition)

Broadcasts to a condition variable, waking up all goroutines that are waiting on it.

**Syntax:**

```kodeon
broadcast_condition(condition)
```

**Parameters:**

- `condition`: The condition variable to broadcast to.

## Atomic Operations

### create_address(initial_value)

Creates an address (pointer) that can be used with atomic operations.

**Syntax:**

```kodeon
var address = create_address(initial_value)
```

**Parameters:**

- `initial_value`: The initial value to store at the address.

**Returns:** An address that can be used with atomic operations.

### atomic_load(address)

Atomically loads a value from an address.

**Syntax:**

```kodeon
var value = atomic_load(address)
```

**Parameters:**

- `address`: The address to load from.

**Returns:** The value loaded from the address.

### atomic_store(address, value)

Atomically stores a value to an address.

**Syntax:**

```kodeon
atomic_store(address, value)
```

**Parameters:**

- `address`: The address to store to.
- `value`: The value to store.

### atomic_exchange(address, value)

Atomically exchanges a value at an address, returning the old value.

**Syntax:**

```kodeon
var old_value = atomic_exchange(address, value)
```

**Parameters:**

- `address`: The address to exchange at.
- `value`: The new value.

**Returns:** The old value that was at the address.

### atomic_compare_exchange(address, expected, desired)

Atomically compares the value at an address with an expected value and exchanges it with a desired value if they match.

**Syntax:**

```kodeon
var result = atomic_compare_exchange(address, expected, desired)
```

**Parameters:**

- `address`: The address to compare and exchange at.
- `expected`: The expected value.
- `desired`: The desired value.

**Returns:** True if the exchange was performed, false otherwise.

### atomic_fetch_add(address, value)

Atomically adds a value to the value at an address and returns the old value.

**Syntax:**

```kodeon
var old_value = atomic_fetch_add(address, value)
```

**Parameters:**

- `address`: The address to add to.
- `value`: The value to add.

**Returns:** The old value that was at the address.

### atomic_fetch_sub(address, value)

Atomically subtracts a value from the value at an address and returns the old value.

**Syntax:**

```kodeon
var old_value = atomic_fetch_sub(address, value)
```

**Parameters:**

- `address`: The address to subtract from.
- `value`: The value to subtract.

**Returns:** The old value that was at the address.

## Atomic Ordering

Atomic operations can specify ordering constraints:

- `Relaxed`: No ordering constraints
- `Consume`: Data dependency ordering
- `Acquire`: Acquire ordering
- `Release`: Release ordering
- `AcqRel`: Acquire-release ordering
- `SeqCst`: Sequentially consistent ordering (default)

**Example:**

```kodeon
var value = atomic_load(address, Acquire)
atomic_store(address, 42, Release)
```
