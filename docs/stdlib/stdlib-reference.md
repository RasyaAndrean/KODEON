# KODEON Standard Library Reference

This document provides a comprehensive reference for the KODEON standard library modules.

## Core Module

The core module provides essential functions for input/output, string manipulation, and basic system operations.

### I/O Functions

#### tampilkan / show

Displays a message to the console.

```kodeon
// Indonesian
tampilkan "Halo, Dunia!"

// English
show "Hello, World!"
```

### String Functions

#### panjang_string / string_length

Returns the length of a string.

```kodeon
// Indonesian
buat panjang = panjang_string("KODEON")

// English
create length = string_length("KODEON")
```

#### gabung_string / concat_string

Concatenates two strings.

```kodeon
// Indonesian
buat hasil = gabung_string("Halo", " Dunia")

// English
create result = concat_string("Hello", " World")
```

### Mathematical Functions

#### akar_kuadrat / square_root

Calculates the square root of a number.

```kodeon
// Indonesian
buat akar = akar_kuadrat(16)

// English
create root = square_root(16)
```

#### nilai_mutlak / absolute_value

Calculates the absolute value of a number.

```kodeon
// Indonesian
buat mutlak = nilai_mutlak(-5)

// English
create absolute = absolute_value(-5)
```

### Array Functions

#### panjang_array / array_length

Returns the length of an array.

```kodeon
// Indonesian
buat panjang = panjang_array([1, 2, 3, 4, 5])

// English
create length = array_length([1, 2, 3, 4, 5])
```

### System Functions

#### keluar / exit

Exits the program with a specified exit code.

```kodeon
// Indonesian
keluar(0)

// English
exit(0)
```

## Math Module

The math module provides advanced mathematical functions and constants.

### Constants

#### PI

The mathematical constant π (pi).

```kodeon
// Indonesian
buat lingkaran = Matematika()
tampilkan lingkaran.PI

// English
create circle = Math()
show circle.PI
```

#### E

The mathematical constant e (Euler's number).

```kodeon
// Indonesian
buat euler = Matematika().E

// English
create euler = Math().E
```

### Trigonometric Functions

#### sinus / sine

Calculates the sine of an angle.

```kodeon
// Indonesian
buat hasil = Matematika().sinus(1.57)

// English
create result = Math().sine(1.57)
```

#### cosinus / cosine

Calculates the cosine of an angle.

```kodeon
// Indonesian
buat hasil = Matematika().cosinus(0)

// English
create result = Math().cosine(0)
```

#### tangen / tangent

Calculates the tangent of an angle.

```kodeon
// Indonesian
buat hasil = Matematika().tangen(0.785)

// English
create result = Math().tangent(0.785)
```

### Exponential Functions

#### pangkat / power

Raises a base to an exponent.

```kodeon
// Indonesian
buat hasil = Matematika().pangkat(2, 3)

// English
create result = Math().power(2, 3)
```

#### eksponensial / exponential

Calculates e raised to a power.

```kodeon
// Indonesian
buat hasil = Matematika().eksponensial(1)

// English
create result = Math().exponential(1)
```
