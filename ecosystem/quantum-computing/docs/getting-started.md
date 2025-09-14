# Getting Started with KODEON Quantum Computing Framework

This guide will help you get started with the KODEON Quantum Computing Framework, a comprehensive library for quantum computing simulations in the KODEON programming language.

## Installation

To use the KODEON Quantum Computing Framework in your project, simply import it:

```kodeon
impor "quantum" sebagai kuantum
```

## Creating Your First Quantum Program

Here's a simple example that demonstrates creating a quantum circuit with entanglement:

```kodeon
// Import the quantum computing framework
impor "quantum" sebagai kuantum

// Create a quantum engine
buat mesin = kuantum.buat_mesin_kuantum()

// Initialize with 2 qubits
mesin.inisialisasi_mesin(2)

// Apply Hadamard gate to first qubit (creates superposition)
mesin.terapkan_gerbang(kuantum.hadamard.GerbangH(), 0)

// Apply CNOT gate (creates entanglement)
mesin.terapkan_gerbang(kuantum.cnot.GerbangCNOT(), 1, 0)

// Run the circuit
buat hasil = mesin.jalankan_sirkuit()

// Measure the qubits
buat pengukuran = mesin.ukur_semua()

tampilkan("Hasil pengukuran: " + pengukuran)
```

## Working with Qubits

### Creating Qubits

```kodeon
// Create a single qubit
buat qubit = kuantum.qubit.Qubit()

// Create a register of 3 qubits
buat register = kuantum.register.RegisterQubit(3)

// Access individual qubits
buat qubit_pertama = register.dapatkan_qubit(0)
```

### Qubit States

```kodeon
// Create a qubit in superposition
buat qubit = kuantum.qubit.Qubit()
qubit.terapkan_gerbang(kuantum.hadamard.GerbangH().matriks)

// Display the qubit state
tampilkan(qubit.dapatkan_keadaan_string())

// Measure the qubit
buat hasil = qubit.ukur()
tampilkan("Hasil pengukuran: " + hasil)
```

## Quantum Gates

### Single-Qubit Gates

```kodeon
// Pauli X gate (quantum NOT)
buat gerbang_x = kuantum.pauli.GerbangX()

// Hadamard gate (creates superposition)
buat gerbang_h = kuantum.hadamard.GerbangH()

// Apply gates to qubits
qubit.terapkan_gerbang(gerbang_x.matriks)
```

### Controlled Gates

```kodeon
// CNOT gate
buat gerbang_cnot = kuantum.cnot.GerbangCNOT()

// Apply to a register (control=0, target=1)
register.terapkan_gerbang_terkontrol(gerbang_cnot.matriks, 0, 1)
```

## Building Quantum Circuits

```kodeon
// Create a quantum circuit
buat sirkuit = kuantum.sirkuit.SirkuitKuantum()
sirkuit.atur_nama("Sirkuit Bell")

// Add gates to the circuit
sirkuit.tambah_gerbang(kuantum.hadamard.GerbangH(), 0)
sirkuit.tambah_gerbang(kuantum.cnot.GerbangCNOT(), 1, 0)

// Visualize the circuit
tampilkan(sirkuit.visualisasi())

// Optimize the circuit
sirkuit.optimasi()
```

## Running Quantum Algorithms

```kodeon
// Create a quantum engine
buat mesin = kuantum.buat_mesin_kuantum()
mesin.inisialisasi_mesin(3)

// Run Grover's algorithm
buat parameter = {
    database_ukuran: 8,
    item_dicari: 5
}

buat hasil = mesin.jalankan_algoritma("grover", parameter)
tampilkan("Hasil: " + hasil.hasil)
```

## Visualization

```kodeon
// Create a visualizer
buat visualisasi = kuantum.visualisasi.buat_visualisasi()

// Visualize quantum state probabilities
buat keadaan = [0.707+0i, 0+0i, 0+0i, 0.707+0i]  // Bell state
tampilkan(visualisasi.visualisasi_probabilitas(keadaan))

// Visualize measurement results
buat hasil_pengukuran = [[0,1], [0,1], [1,0], [0,1], [0,1]]
tampilkan(visualisasi.visualisasi_pengukuran(hasil_pengukuran, 1000))
```

## Advanced Features

### Entanglement

```kodeon
// Create a register of 3 qubits
buat register = kuantum.register.RegisterQubit(3)

// Entangle qubits 0 and 1
register.entangle(0, 1)

// Apply operations to see entanglement effects
```

### Custom Gates

```kodeon
// Create a custom rotation gate
kelas GerbangRotasi:
    fungsi inisialisasi(sudut):
        buat cos_theta = cos(sudut/2)
        buat sin_theta = sin(sudut/2)
        induk.inisialisasi("R(θ)", [[cos_theta, -sin_theta], [sin_theta, cos_theta]], 1)
```

## Best Practices

1. **Initialize Before Use**: Always initialize the quantum engine with the required number of qubits
2. **Measure at the End**: Measurements collapse the quantum state, so apply them at the end of your computation
3. **Optimize Circuits**: Use the circuit optimization features to reduce gate count
4. **Handle Errors**: Check return values and handle potential errors appropriately

## Next Steps

-   Explore the [examples](../examples/) directory for more complex implementations
-   Read the [API Reference](api-reference.md) for detailed information about all available methods
-   Learn about [quantum algorithms](algorithms.md) and their implementations
-   Check out [circuit design patterns](circuit-design.md) for common quantum circuits
