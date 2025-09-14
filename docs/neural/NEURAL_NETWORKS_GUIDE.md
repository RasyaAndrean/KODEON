# Neural Networks in KODEON

This guide explains how to use neural network features in the KODEON programming language.

## Overview

KODEON provides built-in support for neural networks with a natural language syntax that makes machine learning accessible to everyone. The language includes neural network-specific keywords, data types, and operations.

## Neural Network Keywords

KODEON supports both Indonesian and English keywords for neural networks:

### Indonesian Keywords

-   `jaringan` - Define a neural network
-   `lapisan` - Define a layer
-   `tensor` - Declare a tensor
-   `model` - Declare a model
-   `latih` - Train a model
-   `prediksi` - Make predictions
-   `optimisasi` - Optimize a model
-   `fungsi_hilang` - Define a loss function
-   `gradien` - Compute gradients

### English Keywords

-   `network` - Define a neural network
-   `layer` - Define a layer
-   `tensor` - Declare a tensor
-   `model` - Declare a model
-   `train` - Train a model
-   `predict` - Make predictions
-   `optimize` - Optimize a model
-   `loss_function` - Define a loss function
-   `gradient` - Compute gradients

## Neural Network Data Types

### Tensor

A tensor is a multi-dimensional array used in neural networks. In KODEON, you can declare tensors using the `tensor` keyword:

```kodeon
// Declare a tensor
tensor data
tensor weights = [[1, 2, 3], [4, 5, 6]]
```

### Model

A model represents a neural network architecture. In KODEON, you can declare models using the `model` keyword:

```kodeon
// Declare a model
model neural_net
```

## Neural Network Operations

### Layer Definition

Define neural network layers using the `lapisan` or `layer` keyword:

```kodeon
// Define a dense layer
lapisan.padat(784, 128)

// Define an activation layer
lapisan.aktivasi("relu")

// Define a dropout layer
lapisan.dropout(0.2)
```

### Model Training

Train neural network models using the `latih` or `train` keyword:

```kodeon
// Train a model
latih(neural_net, training_data, training_labels, 10, 32)
```

### Making Predictions

Make predictions with trained models using the `prediksi` or `predict` keyword:

```kodeon
// Make predictions
buat predictions = prediksi(neural_net, test_data)
```

## Standard Library Modules

### Neural Network Layers Module

The `neural/layers` module provides implementations of common neural network layers:

-   `lapisan_padat(input_size, output_size)` - Dense (fully connected) layer
-   `lapisan_konvolusi(filter_size, num_filters)` - Convolutional layer
-   `lapisan_rekuren(units)` - Recurrent layer
-   `lapisan_dropout(rate)` - Dropout layer
-   `lapisan_aktivasi(activation_function)` - Activation layer

### Neural Network Models Module

The `neural/models` module provides tools for creating and training neural network models:

-   `buat_model_sequential()` - Create a sequential model
-   `tambah_lapisan(model, layer)` - Add a layer to a model
-   `kompilasi(model, optimizer, loss_function)` - Compile a model
-   `latih(model, data, labels, epochs, batch_size)` - Train a model
-   `prediksi(model, data)` - Make predictions with a model

## Example Programs

### Simple Neural Network

```kodeon
// Import neural network modules
impor "neural/layers" sebagai lapisan
impor "neural/models" sebagai model

// Create a sequential model
buat nn = model.buat_model_sequential()

// Add layers to the model
nn = model.tambah_lapisan(nn, lapisan.lapisan_padat(784, 128))
nn = model.tambah_lapisan(nn, lapisan.lapisan_aktivasi("relu"))
nn = model.tambah_lapisan(nn, lapisan.lapisan_dropout(0.2))
nn = model.tambah_lapisan(nn, lapisan.lapisan_padat(128, 10))
nn = model.tambah_lapisan(nn, lapisan.lapisan_aktivasi("softmax"))

// Compile the model
nn = model.kompilasi(nn, "adam", "sparse_categorical_crossentropy")

// Display model information
tampilkan("Neural Network Model:")
tampilkan(nn)

// Train the model (in a real implementation)
// model.latih(nn, training_data, training_labels, 10, 32)
```

## Best Practices

1. **Start Simple**: Begin with simple architectures before moving to complex models
2. **Choose Appropriate Layers**: Select layers that match your problem type
3. **Set Proper Hyperparameters**: Choose appropriate learning rates, batch sizes, and epochs
4. **Monitor Training**: Track loss and accuracy during training to detect issues
5. **Validate Results**: Use separate validation data to evaluate model performance

## Limitations

Currently, KODEON's neural network features are focused on high-level abstractions for education and prototyping. Advanced features like custom layers and optimizers will be added in future versions.
