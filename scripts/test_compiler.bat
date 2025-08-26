@echo off
echo Testing KODEON compiler...

echo Compiling simple_add.kodeon...
cargo run -- tests/simple_add.kodeon --llvm

echo Test completed.
