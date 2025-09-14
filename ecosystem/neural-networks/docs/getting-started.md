# Getting Started with KODEON Neural Networks Framework

This guide will help you get started with the KODEON Neural Networks Framework, a comprehensive library for machine learning in the KODEON programming language.

## Installation

To use the KODEON Neural Networks Framework in your project, simply import it:

```kodeon
impor "neural" sebagai neural
```

## Creating Your First Neural Network

Here's a simple example that demonstrates creating and training a neural network for classification:

```kodeon
// Import the neural networks framework
impor "neural" sebagai neural

// Create a sequential model
buat model = neural.sequential.ModelSequential()

// Add layers to the model
model.tambah(neural.padat.LapisanPadat(784, 128, neural.relu.AktivasiReLU()))
model.tambah(neural.dropout.LapisanDropout(0.2))
model.tambah(neural.padat.LapisanPadat(128, 10, neural.softmax.AktivasiSoftmax()))

tampilkan("Arsitektur model:")
model.ringkasan()

// Compile the model
model.kompilasi(
    neural.adam.OptimizerAdam(0.001),
    neural.kategorikal_crossentropi.LossCategoricalCrossentropy()
)

tampilkan("Model telah dikompilasi")
```

## Working with Layers

### Dense Layers

```kodeon
// Create a dense layer with ReLU activation
buat lapisan_dense = neural.padat.LapisanPadat(128, 64, neural.relu.AktivasiReLU())

// Add to model
model.tambah(lapisan_dense)
```

### Convolutional Layers

```kodeon
// Create a convolutional layer
buat lapisan_conv = neural.konvolusi.LapisanKonvolusi(28, 28, 1, 3, 32, 1, 0)

// Add to model
model.tambah(lapisan_conv)
```

### Dropout Layers

```kodeon
// Create a dropout layer with 50% dropout rate
buat lapisan_dropout = neural.dropout.LapisanDropout(0.5)

// Add to model
model.tambah(lapisan_dropout)
```

## Optimizers

### Stochastic Gradient Descent (SGD)

```kodeon
// Create SGD optimizer with learning rate 0.01
buat optimizer_sgd = neural.sgd.OptimizerSGD(0.01)

// Compile model with SGD
model.kompilasi(optimizer_sgd, neural.mse.LossMSE())
```

### Adam Optimizer

```kodeon
// Create Adam optimizer with learning rate 0.001
buat optimizer_adam = neural.adam.OptimizerAdam(0.001)

// Compile model with Adam
model.kompilasi(optimizer_adam, neural.kategorikal_crossentropi.LossCategoricalCrossentropy())
```

## Loss Functions

### Mean Squared Error

```kodeon
// Create MSE loss function
buat loss_mse = neural.mse.LossMSE()

// Compile model with MSE
model.kompilasi(neural.sgd.OptimizerSGD(0.01), loss_mse)
```

### Categorical Crossentropy

```kodeon
// Create categorical crossentropy loss function
buat loss_categorical = neural.kategorikal_crossentropi.LossCategoricalCrossentropy()

// Compile model with categorical crossentropy
model.kompilasi(neural.adam.OptimizerAdam(0.001), loss_categorical)
```

## Training a Model

```kodeon
// Generate synthetic data for demonstration
buat data_sintetis = neural.data.hasilkan_data_sintetis(1000, 784)
buat data_latih = data_sintetis.data
buat label_latih = data_sintetis.label

// Convert labels to one-hot encoding
buat label_one_hot = []
untuk setiap label dalam label_latih:
    label_one_hot.tambah(neural.utilitas.one_hot_encode(label, 10))

// Train the model
tampilkan("Memulai pelatihan...")
buat riwayat = model.latih(data_latih, label_one_hot, 50, 32)

tampilkan("Pelatihan selesai!")
```

## Visualization

```kodeon
// Create a visualizer
buat visualisasi = neural.visualisasi.buat_visualisasi()

// Visualize training history
visualisasi.visualisasi_riwayat(riwayat)

// Visualize model architecture
visualisasi.visualisasi_arsitektur(model)
```

## Making Predictions

```kodeon
// Generate test data
buat data_test_sintetis = neural.data.hasilkan_data_sintetis(100, 784)
buat data_test = data_test_sintetis.data

// Make predictions
untuk setiap sampel dalam data_test:
    buat prediksi = model.prediksi(sampel)
    tampilkan("Prediksi: " + prediksi)
```

## Data Preprocessing

```kodeon
// Load data
buat dataset = neural.data.muat_data("data.csv")

// Preprocess data
buat data_diproses = neural.utilitas.pra_proses_data(dataset.data)

// Split data into train and test sets
buat data_terbagi = neural.utilitas.bagi_data(data_diproses, dataset.label, 0.8)
buat data_latih = data_terbagi.data_latih
buat label_latih = data_terbagi.label_latih
buat data_test = data_terbagi.data_test
buat label_test = data_terbagi.label_test
```

## Best Practices

1. **Start Simple**: Begin with simple architectures and gradually increase complexity
2. **Data Preprocessing**: Always preprocess your data before training
3. **Validation**: Use validation data to monitor for overfitting
4. **Hyperparameter Tuning**: Experiment with different learning rates, batch sizes, and optimizers
5. **Regularization**: Use dropout and other regularization techniques to prevent overfitting

## Next Steps

-   Explore the [examples](../examples/) directory for more complex implementations
-   Read the [API Reference](api-reference.md) for detailed information about all available methods
-   Learn about [model architectures](architectures.md) and design patterns
-   Check out [advanced training techniques](advanced-training.md) for improving model performance
