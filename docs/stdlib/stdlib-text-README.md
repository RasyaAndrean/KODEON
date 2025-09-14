# Text Module

This directory contains the text manipulation and processing functions for the KODEON standard library.

## Purpose

The text module provides comprehensive string manipulation and processing capabilities, including:

-   String creation and formatting
-   String analysis and searching
-   String transformation (case conversion, trimming)
-   Encoding and decoding operations
-   Regular expression support

## Functions

-   `panjang_string(str)` / `string_length(str)` - Get the length of a string
-   `gabung_string(a, b)` / `concat_string(a, b)` - Concatenate two strings
-   `besar_string(str)` / `string_upper(str)` - Convert string to uppercase
-   `kecil_string(str)` / `string_lower(str)` - Convert string to lowercase
-   `potong_string(str)` / `string_trim(str)` - Trim whitespace from string
-   `bagi_string(str, pembatas)` / `string_split(str, delimiter)` - Split string by delimiter
-   `ganti_string(str, cari, ganti)` / `string_replace(str, search, replace)` - Replace substring
-   `format_string(pola, ...args)` / `string_format(pattern, ...args)` - Format string with arguments
-   `sub_string(str, awal, akhir)` / `substring(str, start, end)` - Extract substring
-   `cari_string(str, cari)` / `string_find(str, search)` - Find substring in string

## Implementation Status

🚧 Partially implemented - See [core.kodeon](../core/core.kodeon) for current implementation

## Related Modules

-   [core/](../core/) - Core module containing basic string functions
-   [encoding/](../encoding/) - Data encoding and decoding functions
