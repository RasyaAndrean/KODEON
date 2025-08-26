# Reflection Module

This directory will contain the runtime reflection capabilities for the KODEON standard library.

## Purpose

The reflection module provides functions for examining and manipulating program structure at runtime, including:

-   Type introspection
-   Function metadata inspection
-   Object property enumeration
-   Dynamic function invocation
-   Code generation capabilities

## Planned Functions

-   `dapatkan_tipe(objek)` / `get_type(object)` - Get the type of an object
-   `dapatkan_properti(objek)` / `get_properties(object)` - Get object properties
-   `dapatkan_metode(objek)` / `get_methods(object)` - Get object methods
-   `panggil_fungsi(nama, ...args)` / `call_function(name, ...args)` - Call function by name
-   `buat_objek(tipe)` / `create_object(type)` - Create object of specified type
-   `apakah_memiliki_properti(objek, nama)` / `has_property(object, name)` - Check if object has property

## Implementation Status

🚧 Not yet implemented - Planned for Phase 2

## Related Modules

-   [types/](../core/) - Type inspection and conversion functions
-   [core/](../core/) - Core module containing basic reflection capabilities
