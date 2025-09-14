# KODEON Neural Networks Framework

A comprehensive neural networks library for the KODEON programming language that brings the power of machine learning to developers using natural language syntax.

## Overview

The KODEON Neural Networks Framework provides developers with tools to create, train, and deploy neural networks using the intuitive syntax of the KODEON programming language. With support for various layer types, optimizers, and loss functions, this framework makes machine learning accessible to everyone.

## Features

-   **Layer Types**: Dense, Convolutional, Pooling, Dropout, and more
-   **Optimizers**: SGD, Adam, and other optimization algorithms
-   **Loss Functions**: MSE, Categorical Crossentropy, and more
-   **Activation Functions**: ReLU, Sigmoid, Softmax, and more
-   **Model Architectures**: Sequential and Functional APIs
-   **Training Utilities**: Data preprocessing, validation, and visualization
-   **Natural Language**: Fully integrated with KODEON's Indonesian/English dual-language support

## Installation

To use the KODEON Neural Networks Framework in your project, simply import it:

```kodeon
impor "neural" sebagai neural
```

## Quick Start

Here's a simple example of creating and training a neural network:

```kodeon
// Import the neural networks framework
impor "neural" sebagai neural

// Create a sequential model
buat model = neural.sequential.ModelSequential()

// Add layers
model.tambah(neural.padat.LapisanPadat(784, 128, neural.relu.AktivasiReLU()))
model.tambah(neural.dropout.LapisanDropout(0.2))
model.tambah(neural.padat.LapisanPadat(128, 10, neural.softmax.AktivasiSoftmax()))

// Compile the model
model.kompilasi(neural.adam.OptimizerAdam(0.001), neural.kategorikal_crossentropi.LossCategoricalCrossentropy())

// Train the model (assuming you have data_latih and label_latih)
buat riwayat = model.latih(data_latih, label_latih, 100, 32)

// Make predictions
buat prediksi = model.prediksi(data_test)
```

## Components

### Core

-   Network engine for orchestrating computations
-   Trainer for handling the training process

### Layers

-   Dense (fully connected) layers
-   Convolutional layers
-   Pooling layers
-   Dropout layers
-   Custom layer support

### Models

-   Sequential model API
-   Functional model API (planned)

### Optimizers

-   Stochastic Gradient Descent (SGD)
-   Adam optimizer
-   Custom optimizer support

### Loss Functions

-   Mean Squared Error (MSE)
-   Categorical Crossentropy
-   Custom loss function support

### Activation Functions

-   ReLU
-   Sigmoid
-   Softmax
-   Custom activation function support

## Documentation

-   [Getting Started Guide](docs/getting-started.md)
-   [API Reference](docs/api-reference.md)
-   [Model Architectures](docs/architectures.md)
-   [Examples](examples/)

## Examples

Check out the [examples](examples/) directory for more complex implementations including:

-   Image classification
-   Text processing
-   Time series prediction
-   Reinforcement learning

## Contributing

We welcome contributions to the KODEON Neural Networks Framework! Please see our [contributing guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
