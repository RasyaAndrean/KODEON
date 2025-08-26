# KODEON Neural Networks Implementation

This document provides detailed technical specifications for implementing neural network capabilities in the KODEON programming language, making machine learning accessible through intuitive natural language syntax.

## Architecture Overview

The neural networks module follows a layered architecture that abstracts the complexity of deep learning while providing powerful customization options:

```
┌─────────────────────────────────────────────────────────────┐
│              KODEON Neural Network Syntax                   │
├─────────────────────────────────────────────────────────────┤
│           High-Level ML API                                 │
├─────────────────────────────────────────────────────────────┤
│        Neural Network Framework                             │
├─────────────────────────────────────────────────────────────┤
│         Automatic Differentiation Engine                    │
├─────────────────────────────────────────────────────────────┤
│       Hardware Acceleration Layer                           │
├─────────────────────────────────────────────────────────────┤
│    Compute Backends (CPU/GPU/TPU)                           │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Neural Network Syntax Layer

#### Model Definition

```kodeon
// Neural network model definition in KODEON
buat model neural_network "image_classifier":
    input_layer dengan bentuk (28, 28, 1)  // MNIST images
    convolutional_layer dengan filter=32, kernel=(3, 3), aktivasi=relu
    max_pooling_layer dengan pool_size=(2, 2)
    convolutional_layer dengan filter=64, kernel=(3, 3), aktivasi=relu
    max_pooling_layer dengan pool_size=(2, 2)
    flatten_layer
    dense_layer dengan neuron=128, aktivasi=relu
    dropout_layer dengan rate=0.5
    output_layer dengan neuron=10, aktivasi=softmax  // 10 classes

    kompilasi dengan:
        optimizer = adam
        loss_function = sparse_categorical_crossentropy
        metrics = [accuracy]
```

#### Training Configuration

```kodeon
// Training configuration
latih model dengan:
    data_training = "mnist_train.csv"
    data_validasi = "mnist_validation.csv"
    epochs = 10
    batch_size = 32
    augmentasi_data = true
    callbacks = [
        early_stopping(patience=3),
        model_checkpoint("best_model.h5"),
        learning_rate_scheduler(reduce_factor=0.5)
    ]
```

### 2. High-Level ML API

#### Model Creation Interface

```python
# neural_networks/api/model_builder.py
class NeuralNetworkBuilder:
    def __init__(self, name):
        self.name = name
        self.layers = []
        self.compilation_config = {}
        self.training_config = {}

    def input_layer(self, shape):
        """Define input layer"""
        layer = InputLayer(shape)
        self.layers.append(layer)
        return self

    def dense_layer(self, neurons, activation="relu", **kwargs):
        """Add dense (fully connected) layer"""
        layer = DenseLayer(neurons, activation, **kwargs)
        self.layers.append(layer)
        return self

    def convolutional_layer(self, filters, kernel_size, activation="relu", **kwargs):
        """Add convolutional layer"""
        layer = ConvolutionalLayer(filters, kernel_size, activation, **kwargs)
        self.layers.append(layer)
        return self

    def compile(self, optimizer="adam", loss="mse", metrics=None):
        """Compile the model"""
        self.compilation_config = {
            "optimizer": optimizer,
            "loss": loss,
            "metrics": metrics or []
        }
        return self

    def build(self):
        """Build the neural network model"""
        model = NeuralNetworkModel(self.name)
        for layer in self.layers:
            model.add_layer(layer)
        model.compile(**self.compilation_config)
        return model
```

#### Layer Types Implementation

```python
# neural_networks/layers/base.py
class Layer:
    def __init__(self, name=None):
        self.name = name or self.__class__.__name__
        self.input_shape = None
        self.output_shape = None
        self.parameters = {}

    def build(self, input_shape):
        """Build layer with given input shape"""
        self.input_shape = input_shape
        self.output_shape = self.compute_output_shape(input_shape)

    def forward(self, inputs):
        """Forward pass through the layer"""
        raise NotImplementedError

    def backward(self, gradients):
        """Backward pass for gradient computation"""
        raise NotImplementedError

class DenseLayer(Layer):
    def __init__(self, neurons, activation="relu", **kwargs):
        super().__init__(**kwargs)
        self.neurons = neurons
        self.activation = activation
        self.weights = None
        self.biases = None

    def build(self, input_shape):
        super().build(input_shape)
        # Initialize weights and biases
        self.weights = np.random.normal(
            0, 0.1, (input_shape[-1], self.neurons)
        )
        self.biases = np.zeros((1, self.neurons))

    def forward(self, inputs):
        """Linear transformation followed by activation"""
        linear_output = np.dot(inputs, self.weights) + self.biases
        activated_output = self.apply_activation(linear_output)
        return activated_output

    def apply_activation(self, x):
        """Apply activation function"""
        if self.activation == "relu":
            return np.maximum(0, x)
        elif self.activation == "sigmoid":
            return 1 / (1 + np.exp(-x))
        elif self.activation == "softmax":
            exp_x = np.exp(x - np.max(x, axis=-1, keepdims=True))
            return exp_x / np.sum(exp_x, axis=-1, keepdims=True)
        return x
```

### 3. Automatic Differentiation Engine

#### Computational Graph

```python
# neural_networks/autodiff/graph.py
class ComputationalGraph:
    def __init__(self):
        self.nodes = []
        self.edges = []

    def add_operation(self, operation, inputs, output):
        """Add operation to computational graph"""
        node = ComputationNode(operation, inputs, output)
        self.nodes.append(node)
        return node

    def backward(self, loss):
        """Backward pass through computational graph"""
        # Topological sort of nodes
        sorted_nodes = self.topological_sort()

        # Initialize gradients
        gradients = {loss: np.ones_like(loss)}

        # Backward pass
        for node in reversed(sorted_nodes):
            input_gradients = node.compute_gradients(gradients[node.output])
            for i, input_node in enumerate(node.inputs):
                if input_node in gradients:
                    gradients[input_node] += input_gradients[i]
                else:
                    gradients[input_node] = input_gradients[i]

        return gradients

class ComputationNode:
    def __init__(self, operation, inputs, output):
        self.operation = operation
        self.inputs = inputs
        self.output = output

    def compute_gradients(self, output_gradient):
        """Compute gradients with respect to inputs"""
        if self.operation == "matmul":
            # For matrix multiplication: Z = X @ Y
            # dZ/dX = dZ/dZ @ Y^T
            # dZ/dY = X^T @ dZ/dZ
            input_gradients = [
                np.dot(output_gradient, self.inputs[1].T),
                np.dot(self.inputs[0].T, output_gradient)
            ]
            return input_gradients
        # ... other operations
```

#### Gradient Computation

```python
# neural_networks/autodiff/gradients.py
class GradientTape:
    def __init__(self):
        self.graph = ComputationalGraph()
        self.watching = []

    def watch(self, variable):
        """Watch variable for gradient computation"""
        self.watching.append(variable)

    def gradient(self, target, sources):
        """Compute gradients of target with respect to sources"""
        # Build computational graph
        gradients = self.graph.backward(target)

        # Extract gradients for requested sources
        source_gradients = []
        for source in sources:
            if source in gradients:
                source_gradients.append(gradients[source])
            else:
                source_gradients.append(np.zeros_like(source))

        return source_gradients if len(source_gradients) > 1 else source_gradients[0]
```

### 4. Optimizers

#### Optimization Algorithms

```python
# neural_networks/optimizers/optimizer.py
class Optimizer:
    def __init__(self, learning_rate=0.001):
        self.learning_rate = learning_rate

    def update(self, parameters, gradients):
        """Update parameters based on gradients"""
        raise NotImplementedError

class AdamOptimizer(Optimizer):
    def __init__(self, learning_rate=0.001, beta1=0.9, beta2=0.999, epsilon=1e-8):
        super().__init__(learning_rate)
        self.beta1 = beta1
        self.beta2 = beta2
        self.epsilon = epsilon
        self.m = {}  # First moment estimates
        self.v = {}  # Second moment estimates
        self.t = 0   # Time step

    def update(self, parameters, gradients):
        """Adam optimization update"""
        self.t += 1

        updated_parameters = {}
        for name, param in parameters.items():
            grad = gradients[name]

            # Initialize moment estimates if not present
            if name not in self.m:
                self.m[name] = np.zeros_like(param)
                self.v[name] = np.zeros_like(param)

            # Update moment estimates
            self.m[name] = self.beta1 * self.m[name] + (1 - self.beta1) * grad
            self.v[name] = self.beta2 * self.v[name] + (1 - self.beta2) * (grad ** 2)

            # Bias correction
            m_corrected = self.m[name] / (1 - self.beta1 ** self.t)
            v_corrected = self.v[name] / (1 - self.beta2 ** self.t)

            # Update parameters
            updated_parameters[name] = param - self.learning_rate * m_corrected / (np.sqrt(v_corrected) + self.epsilon)

        return updated_parameters
```

## Implementation Phases

### Phase 1: Foundation (Months 1-4)

#### Month 1: Neural Network Syntax and Parser

##### ML Keywords Implementation

- Add machine learning keywords to lexer
- Implement neural network syntax parsing
- Create AST nodes for ML operations
- Add ML type system

##### Lexer Extensions

```rust
// compiler/src/lexer.rs
pub enum TokenKind {
    // ... existing tokens ...

    // ML keywords
    MODEL,
    LAYER,
    DENSE,
    CONVOLUTIONAL,
    RECURRENT,
    ATTENTION,
    TRAIN,
    PREDICT,
    OPTIMIZER,
    LOSS,
    METRICS,
    EPOCHS,
    BATCH_SIZE,

    // Activation functions
    RELU,
    SIGMOID,
    TANH,
    SOFTMAX,
    SOFTPLUS,
    ELU,
}
```

##### Parser Extensions

```rust
// compiler/src/parser.rs
pub enum MLStatement {
    ModelDefinition {
        name: String,
        layers: Vec<LayerDefinition>,
        compilation: CompilationConfig,
    },
    TrainingConfiguration {
        data_source: String,
        epochs: Expression,
        batch_size: Expression,
        callbacks: Vec<CallbackDefinition>,
    },
    PredictionCall {
        model_name: String,
        input_data: Expression,
    },
}

pub struct LayerDefinition {
    pub layer_type: String,
    pub parameters: HashMap<String, Expression>,
    pub activation: Option<String>,
}
```

#### Month 2: Basic Layer Implementation

##### Core Layer Types

```python
# neural_networks/layers/core.py
class InputLayer(Layer):
    def __init__(self, shape, **kwargs):
        super().__init__(**kwargs)
        self.shape = shape

    def build(self, input_shape):
        self.input_shape = input_shape
        self.output_shape = self.shape

    def forward(self, inputs):
        return inputs

class FlattenLayer(Layer):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def compute_output_shape(self, input_shape):
        return (input_shape[0], np.prod(input_shape[1:]))

    def forward(self, inputs):
        batch_size = inputs.shape[0]
        return inputs.reshape(batch_size, -1)

class DropoutLayer(Layer):
    def __init__(self, rate=0.5, **kwargs):
        super().__init__(**kwargs)
        self.rate = rate
        self.mask = None

    def forward(self, inputs, training=True):
        if training:
            # Create random mask
            self.mask = np.random.binomial(1, 1-self.rate, inputs.shape) / (1-self.rate)
            return inputs * self.mask
        else:
            return inputs

    def backward(self, gradients):
        return gradients * self.mask
```

#### Month 3: Forward Pass Engine

##### Neural Network Execution

```python
# neural_networks/model/model.py
class NeuralNetworkModel:
    def __init__(self, name):
        self.name = name
        self.layers = []
        self.compiled = False
        self.optimizer = None
        self.loss_function = None

    def add_layer(self, layer):
        """Add layer to the model"""
        self.layers.append(layer)

    def compile(self, optimizer="adam", loss="mse", metrics=None):
        """Compile the model"""
        self.optimizer = self._create_optimizer(optimizer)
        self.loss_function = self._create_loss_function(loss)
        self.metrics = metrics or []

        # Build layers with proper input shapes
        input_shape = None
        for layer in self.layers:
            layer.build(input_shape)
            input_shape = layer.output_shape

        self.compiled = True

    def forward(self, inputs):
        """Forward pass through the network"""
        output = inputs
        for layer in self.layers:
            output = layer.forward(output)
        return output

    def predict(self, inputs):
        """Make predictions"""
        if not self.compiled:
            raise RuntimeError("Model must be compiled before prediction")
        return self.forward(inputs)
```

#### Month 4: Loss Functions and Metrics

##### Loss Function Implementation

```python
# neural_networks/loss/loss_functions.py
class LossFunction:
    def __call__(self, y_true, y_pred):
        """Compute loss value"""
        raise NotImplementedError

    def gradient(self, y_true, y_pred):
        """Compute gradient of loss with respect to predictions"""
        raise NotImplementedError

class MeanSquaredError(LossFunction):
    def __call__(self, y_true, y_pred):
        return np.mean((y_true - y_pred) ** 2)

    def gradient(self, y_true, y_pred):
        return 2 * (y_pred - y_true) / y_true.shape[0]

class CategoricalCrossentropy(LossFunction):
    def __call__(self, y_true, y_pred):
        # Clip predictions to prevent log(0)
        y_pred = np.clip(y_pred, 1e-15, 1 - 1e-15)
        return -np.sum(y_true * np.log(y_pred)) / y_true.shape[0]

    def gradient(self, y_true, y_pred):
        # Clip predictions to prevent division by zero
        y_pred = np.clip(y_pred, 1e-15, 1 - 1e-15)
        return -y_true / y_pred / y_true.shape[0]

class SparseCategoricalCrossentropy(LossFunction):
    def __call__(self, y_true, y_pred):
        y_pred = np.clip(y_pred, 1e-15, 1 - 1e-15)
        return -np.log(y_pred[np.arange(len(y_true)), y_true.astype(int)]).mean()

    def gradient(self, y_true, y_pred):
        y_pred = np.clip(y_pred, 1e-15, 1 - 1e-15)
        grad = np.copy(y_pred)
        grad[np.arange(len(y_true)), y_true.astype(int)] -= 1
        return grad / y_true.shape[0]
```

##### Metrics Implementation

```python
# neural_networks/metrics/metrics.py
class Metric:
    def __call__(self, y_true, y_pred):
        """Compute metric value"""
        raise NotImplementedError

class Accuracy(Metric):
    def __call__(self, y_true, y_pred):
        if y_pred.ndim > 1 and y_pred.shape[1] > 1:
            # Multi-class classification
            predicted_classes = np.argmax(y_pred, axis=1)
            true_classes = np.argmax(y_true, axis=1) if y_true.ndim > 1 else y_true
        else:
            # Binary classification
            predicted_classes = (y_pred > 0.5).astype(int)
            true_classes = y_true

        return np.mean(predicted_classes == true_classes)

class Precision(Metric):
    def __call__(self, y_true, y_pred):
        predicted_classes = (y_pred > 0.5).astype(int)
        true_classes = y_true.astype(int)

        true_positives = np.sum((predicted_classes == 1) & (true_classes == 1))
        false_positives = np.sum((predicted_classes == 1) & (true_classes == 0))

        if true_positives + false_positives == 0:
            return 0.0

        return true_positives / (true_positives + false_positives)
```

### Phase 2: Training and Optimization (Months 5-8)

#### Month 5: Backward Pass and Gradient Descent

##### Training Loop Implementation

```python
# neural_networks/training/trainer.py
class ModelTrainer:
    def __init__(self, model):
        self.model = model
        self.history = TrainingHistory()

    def fit(self, x_train, y_train, x_val=None, y_val=None,
            epochs=10, batch_size=32, callbacks=None):
        """Train the model"""
        callbacks = callbacks or []

        num_batches = len(x_train) // batch_size

        for epoch in range(epochs):
            epoch_loss = 0.0
            epoch_metrics = {metric: 0.0 for metric in self.model.metrics}

            # Process batches
            for batch in range(num_batches):
                # Get batch data
                start_idx = batch * batch_size
                end_idx = start_idx + batch_size
                x_batch = x_train[start_idx:end_idx]
                y_batch = y_train[start_idx:end_idx]

                # Forward pass
                predictions = self.model.forward(x_batch)

                # Compute loss
                loss = self.model.loss_function(y_batch, predictions)

                # Backward pass
                gradients = self.compute_gradients(y_batch, predictions)

                # Update parameters
                self.model.optimizer.update(self.model.parameters, gradients)

                # Update metrics
                epoch_loss += loss
                for metric in self.model.metrics:
                    epoch_metrics[metric] += metric(y_batch, predictions)

            # Compute epoch averages
            epoch_loss /= num_batches
            for metric in self.model.metrics:
                epoch_metrics[metric] /= num_batches

            # Validation
            val_metrics = {}
            if x_val is not None and y_val is not None:
                val_predictions = self.model.predict(x_val)
                val_metrics["val_loss"] = self.model.loss_function(y_val, val_predictions)
                for metric in self.model.metrics:
                    val_metrics[f"val_{metric}"] = metric(y_val, val_predictions)

            # Update history
            self.history.add_epoch(epoch, epoch_loss, epoch_metrics, val_metrics)

            # Callbacks
            for callback in callbacks:
                callback.on_epoch_end(epoch, self.history.get_latest())

        return self.history
```

#### Month 6: Advanced Optimizers

##### Optimizer Implementations

```python
# neural_networks/optimizers/advanced.py
class SGDOptimizer(Optimizer):
    def __init__(self, learning_rate=0.01, momentum=0.0):
        super().__init__(learning_rate)
        self.momentum = momentum
        self.velocity = {}

    def update(self, parameters, gradients):
        updated_parameters = {}
        for name, param in parameters.items():
            grad = gradients[name]

            # Initialize velocity if not present
            if name not in self.velocity:
                self.velocity[name] = np.zeros_like(param)

            # Update velocity
            self.velocity[name] = self.momentum * self.velocity[name] - self.learning_rate * grad

            # Update parameters
            updated_parameters[name] = param + self.velocity[name]

        return updated_parameters

class RMSpropOptimizer(Optimizer):
    def __init__(self, learning_rate=0.001, rho=0.9, epsilon=1e-8):
        super().__init__(learning_rate)
        self.rho = rho
        self.epsilon = epsilon
        self.mean_square = {}

    def update(self, parameters, gradients):
        updated_parameters = {}
        for name, param in parameters.items():
            grad = gradients[name]

            # Initialize mean square if not present
            if name not in self.mean_square:
                self.mean_square[name] = np.zeros_like(param)

            # Update mean square
            self.mean_square[name] = self.rho * self.mean_square[name] + (1 - self.rho) * grad ** 2

            # Update parameters
            updated_parameters[name] = param - self.learning_rate * grad / (np.sqrt(self.mean_square[name]) + self.epsilon)

        return updated_parameters
```

#### Month 7: Regularization Techniques

##### Regularization Implementation

```kodeon
// Regularization in KODEON
buat model neural_network "regularized_model":
    input_layer dengan bentuk (784)
    dense_layer dengan neuron=128, aktivasi=relu
    dropout_layer dengan rate=0.3
    dense_layer dengan neuron=64, aktivasi=relu,
        regularizer=l2(0.01)  // L2 regularization
    dense_layer dengan neuron=10, aktivasi=softmax

    kompilasi dengan:
        optimizer = adam
        loss_function = sparse_categorical_crossentropy
        metrics = [accuracy]
```

```python
# neural_networks/regularization/regularizers.py
class Regularizer:
    def __call__(self, weights):
        """Compute regularization penalty"""
        raise NotImplementedError

    def gradient(self, weights):
        """Compute gradient of regularization"""
        raise NotImplementedError

class L1Regularizer(Regularizer):
    def __init__(self, lambda_reg=0.01):
        self.lambda_reg = lambda_reg

    def __call__(self, weights):
        return self.lambda_reg * np.sum(np.abs(weights))

    def gradient(self, weights):
        return self.lambda_reg * np.sign(weights)

class L2Regularizer(Regularizer):
    def __init__(self, lambda_reg=0.01):
        self.lambda_reg = lambda_reg

    def __call__(self, weights):
        return self.lambda_reg * np.sum(weights ** 2)

    def gradient(self, weights):
        return 2 * self.lambda_reg * weights
```

#### Month 8: Data Preprocessing and Augmentation

##### Data Pipeline

```python
# neural_networks/data/data_pipeline.py
class DataPreprocessor:
    def __init__(self):
        self.transforms = []

    def normalize(self, mean=0.0, std=1.0):
        """Add normalization transform"""
        self.transforms.append(lambda x: (x - mean) / std)
        return self

    def resize(self, size):
        """Add resize transform"""
        self.transforms.append(lambda x: self._resize_image(x, size))
        return self

    def augment(self, rotation_range=0, width_shift_range=0, height_shift_range=0):
        """Add data augmentation"""
        self.transforms.append(lambda x: self._augment_image(
            x, rotation_range, width_shift_range, height_shift_range
        ))
        return self

    def apply(self, data):
        """Apply all transforms to data"""
        for transform in self.transforms:
            data = transform(data)
        return data

class DataGenerator:
    def __init__(self, x_data, y_data, batch_size=32, shuffle=True):
        self.x_data = x_data
        self.y_data = y_data
        self.batch_size = batch_size
        self.shuffle = shuffle
        self.indices = np.arange(len(x_data))
        if shuffle:
            np.random.shuffle(self.indices)

    def __iter__(self):
        for i in range(0, len(self.x_data), self.batch_size):
            batch_indices = self.indices[i:i+self.batch_size]
            x_batch = self.x_data[batch_indices]
            y_batch = self.y_data[batch_indices]
            yield x_batch, y_batch
```

### Phase 3: Advanced Architectures (Months 9-12)

#### Month 9: Convolutional Neural Networks

##### CNN Implementation

```python
# neural_networks/layers/convolutional.py
class ConvolutionalLayer(Layer):
    def __init__(self, filters, kernel_size, stride=1, padding="valid", activation="relu", **kwargs):
        super().__init__(**kwargs)
        self.filters = filters
        self.kernel_size = kernel_size if isinstance(kernel_size, tuple) else (kernel_size, kernel_size)
        self.stride = stride
        self.padding = padding
        self.activation = activation

    def build(self, input_shape):
        super().build(input_shape)
        # Initialize weights and biases
        self.weights = np.random.normal(
            0, 0.1, (self.filters, input_shape[-1], self.kernel_size[0], self.kernel_size[1])
        )
        self.biases = np.zeros((1, 1, 1, self.filters))

    def forward(self, inputs):
        """Convolutional forward pass"""
        if self.padding == "same":
            inputs = self._pad_inputs(inputs)

        output = self._convolve(inputs, self.weights, self.stride)
        output = output + self.biases
        output = self._apply_activation(output)
        return output

    def _convolve(self, inputs, kernels, stride):
        """Perform convolution operation"""
        batch_size, height, width, channels = inputs.shape
        kernel_h, kernel_w = self.kernel_size
        out_h = (height - kernel_h) // stride + 1
        out_w = (width - kernel_w) // stride + 1

        output = np.zeros((batch_size, out_h, out_w, self.filters))

        for i in range(out_h):
            for j in range(out_w):
                h_start = i * stride
                h_end = h_start + kernel_h
                w_start = j * stride
                w_end = w_start + kernel_w

                input_slice = inputs[:, h_start:h_end, w_start:w_end, :]
                for f in range(self.filters):
                    output[:, i, j, f] = np.sum(
                        input_slice * kernels[f], axis=(1, 2, 3)
                    )

        return output

class PoolingLayer(Layer):
    def __init__(self, pool_size=(2, 2), pool_type="max", **kwargs):
        super().__init__(**kwargs)
        self.pool_size = pool_size if isinstance(pool_size, tuple) else (pool_size, pool_size)
        self.pool_type = pool_type

    def forward(self, inputs):
        """Pooling forward pass"""
        batch_size, height, width, channels = inputs.shape
        pool_h, pool_w = self.pool_size
        out_h = height // pool_h
        out_w = width // pool_w

        output = np.zeros((batch_size, out_h, out_w, channels))

        for i in range(out_h):
            for j in range(out_w):
                h_start = i * pool_h
                h_end = h_start + pool_h
                w_start = j * pool_w
                w_end = w_start + pool_w

                input_slice = inputs[:, h_start:h_end, w_start:w_end, :]
                if self.pool_type == "max":
                    output[:, i, j, :] = np.max(input_slice, axis=(1, 2))
                elif self.pool_type == "average":
                    output[:, i, j, :] = np.mean(input_slice, axis=(1, 2))

        return output
```

#### Month 10: Recurrent Neural Networks

##### RNN Implementation

```kodeon
// Recurrent Neural Network in KODEON
buat model neural_network "text_classifier":
    input_layer dengan bentuk (sequence_length, vocab_size)
    embedding_layer dengan ukuran=128
    lstm_layer dengan neuron=64, return_sequences=false
    dense_layer dengan neuron=32, aktivasi=relu
    dropout_layer dengan rate=0.5
    output_layer dengan neuron=num_classes, aktivasi=softmax

    kompilasi dengan:
        optimizer = adam
        loss_function = categorical_crossentropy
        metrics = [accuracy]
```

```python
# neural_networks/layers/recurrent.py
class RNNLayer(Layer):
    def __init__(self, units, return_sequences=False, activation="tanh", **kwargs):
        super().__init__(**kwargs)
        self.units = units
        self.return_sequences = return_sequences
        self.activation = activation

    def build(self, input_shape):
        super().build(input_shape)
        # Initialize weights
        input_dim = input_shape[-1]
        self.w_input = np.random.normal(0, 0.1, (input_dim, self.units))
        self.w_hidden = np.random.normal(0, 0.1, (self.units, self.units))
        self.b = np.zeros((1, self.units))

    def forward(self, inputs):
        """RNN forward pass"""
        batch_size, sequence_length, input_dim = inputs.shape
        hidden_states = []

        # Initialize hidden state
        h = np.zeros((batch_size, self.units))

        # Process each time step
        for t in range(sequence_length):
            x_t = inputs[:, t, :]  # Input at time t
            # RNN update: h_t = tanh(W_input * x_t + W_hidden * h_{t-1} + b)
            h = np.tanh(
                np.dot(x_t, self.w_input) +
                np.dot(h, self.w_hidden) +
                self.b
            )
            hidden_states.append(h)

        if self.return_sequences:
            return np.stack(hidden_states, axis=1)
        else:
            return h

class LSTMLayer(Layer):
    def __init__(self, units, return_sequences=False, **kwargs):
        super().__init__(**kwargs)
        self.units = units
        self.return_sequences = return_sequences

    def build(self, input_shape):
        super().build(input_shape)
        input_dim = input_shape[-1]

        # Initialize LSTM weights (forget, input, candidate, output gates)
        self.w = np.random.normal(0, 0.1, (input_dim, 4 * self.units))
        self.u = np.random.normal(0, 0.1, (self.units, 4 * self.units))
        self.b = np.zeros((1, 4 * self.units))

    def forward(self, inputs):
        """LSTM forward pass"""
        batch_size, sequence_length, input_dim = inputs.shape
        hidden_states = []

        # Initialize cell state and hidden state
        c = np.zeros((batch_size, self.units))
        h = np.zeros((batch_size, self.units))

        # Process each time step
        for t in range(sequence_length):
            x_t = inputs[:, t, :]

            # Compute gate values
            gates = np.dot(x_t, self.w) + np.dot(h, self.u) + self.b
            forget_gate = self._sigmoid(gates[:, :self.units])
            input_gate = self._sigmoid(gates[:, self.units:2*self.units])
            candidate = np.tanh(gates[:, 2*self.units:3*self.units])
            output_gate = self._sigmoid(gates[:, 3*self.units:])

            # Update cell state
            c = forget_gate * c + input_gate * candidate

            # Update hidden state
            h = output_gate * np.tanh(c)

            hidden_states.append(h)

        if self.return_sequences:
            return np.stack(hidden_states, axis=1)
        else:
            return h

    def _sigmoid(self, x):
        return 1 / (1 + np.exp(-np.clip(x, -250, 250)))  # Clip to prevent overflow
```

#### Month 11: Attention Mechanisms

##### Attention Implementation

```kodeon
// Attention mechanism in KODEON
buat model neural_network "translator":
    input_layer dengan bentuk (sequence_length, vocab_size)
    embedding_layer dengan ukuran=256
    encoder = lstm_layer dengan neuron=512, return_sequences=true

    // Attention mechanism
    attention_layer dengan:
        query = decoder_hidden_state
        key = encoder_outputs
        value = encoder_outputs

    decoder = lstm_layer dengan neuron=512
    output_layer dengan neuron=target_vocab_size, aktivasi=softmax
```

```python
# neural_networks/layers/attention.py
class AttentionLayer(Layer):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def forward(self, query, key, value):
        """Scaled dot-product attention"""
        # Compute attention scores
        scores = np.dot(query, key.transpose(0, 2, 1))  # (batch, query_len, key_len)

        # Scale by square root of key dimension
        scaled_scores = scores / np.sqrt(key.shape[-1])

        # Apply softmax to get attention weights
        attention_weights = self._softmax(scaled_scores)

        # Apply attention weights to values
        attended_values = np.dot(attention_weights, value)

        return attended_values, attention_weights

    def _softmax(self, x):
        """Numerically stable softmax"""
        exp_x = np.exp(x - np.max(x, axis=-1, keepdims=True))
        return exp_x / np.sum(exp_x, axis=-1, keepdims=True)

class MultiHeadAttention(Layer):
    def __init__(self, num_heads=8, d_model=512, **kwargs):
        super().__init__(**kwargs)
        self.num_heads = num_heads
        self.d_model = d_model
        self.d_k = d_model // num_heads

        # Initialize projection matrices for Q, K, V
        self.w_q = np.random.normal(0, 0.1, (d_model, d_model))
        self.w_k = np.random.normal(0, 0.1, (d_model, d_model))
        self.w_v = np.random.normal(0, 0.1, (d_model, d_model))
        self.w_o = np.random.normal(0, 0.1, (d_model, d_model))

    def forward(self, query, key, value):
        """Multi-head attention forward pass"""
        batch_size = query.shape[0]

        # Linear projections
        q = np.dot(query, self.w_q)  # (batch, seq_len, d_model)
        k = np.dot(key, self.w_k)
        v = np.dot(value, self.w_v)

        # Split into multiple heads
        q = q.reshape(batch_size, -1, self.num_heads, self.d_k).transpose(0, 2, 1, 3)
        k = k.reshape(batch_size, -1, self.num_heads, self.d_k).transpose(0, 2, 1, 3)
        v = v.reshape(batch_size, -1, self.num_heads, self.d_k).transpose(0, 2, 1, 3)

        # Apply attention to each head
        attention_outputs = []
        attention_weights = []

        for i in range(self.num_heads):
            head_q = q[:, i, :, :]
            head_k = k[:, i, :, :]
            head_v = v[:, i, :, :]

            head_output, head_weights = self._single_attention(head_q, head_k, head_v)
            attention_outputs.append(head_output)
            attention_weights.append(head_weights)

        # Concatenate heads
        concatenated = np.concatenate(attention_outputs, axis=-1)

        # Final linear projection
        output = np.dot(concatenated, self.w_o)

        return output, attention_weights
```

#### Month 12: Transformer Architecture

##### Transformer Implementation

```kodeon
// Transformer model in KODEON
buat model neural_network "transformer":
    // Encoder
    untuk i dalam rentang(6):  // 6 encoder layers
        encoder_layer[i] dengan:
            multi_head_attention dengan head=8
            feed_forward dengan hidden=2048
            layer_normalization
            dropout dengan rate=0.1

    // Decoder
    untuk i dalam rentang(6):  // 6 decoder layers
        decoder_layer[i] dengan:
            masked_multi_head_attention dengan head=8
            multi_head_attention dengan head=8
            feed_forward dengan hidden=2048
            layer_normalization
            dropout dengan rate=0.1

    // Output
    linear_layer dengan output_dim=target_vocab_size
    softmax_activation
```

```python
# neural_networks/layers/transformer.py
class TransformerEncoderLayer(Layer):
    def __init__(self, d_model=512, num_heads=8, d_ff=2048, dropout_rate=0.1, **kwargs):
        super().__init__(**kwargs)
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_ff = d_ff
        self.dropout_rate = dropout_rate

        # Sub-layers
        self.multi_head_attention = MultiHeadAttention(num_heads, d_model)
        self.feed_forward = FeedForwardLayer(d_model, d_ff)
        self.layer_norm1 = LayerNormalization()
        self.layer_norm2 = LayerNormalization()
        self.dropout1 = DropoutLayer(dropout_rate)
        self.dropout2 = DropoutLayer(dropout_rate)

    def forward(self, inputs, training=True):
        """Transformer encoder layer forward pass"""
        # Multi-head attention
        attention_output, _ = self.multi_head_attention(inputs, inputs, inputs)
        attention_output = self.dropout1(attention_output, training)
        output1 = self.layer_norm1(inputs + attention_output)

        # Feed forward
        ff_output = self.feed_forward(output1)
        ff_output = self.dropout2(ff_output, training)
        output2 = self.layer_norm2(output1 + ff_output)

        return output2

class TransformerDecoderLayer(Layer):
    def __init__(self, d_model=512, num_heads=8, d_ff=2048, dropout_rate=0.1, **kwargs):
        super().__init__(**kwargs)
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_ff = d_ff
        self.dropout_rate = dropout_rate

        # Sub-layers
        self.masked_multi_head_attention = MultiHeadAttention(num_heads, d_model)
        self.multi_head_attention = MultiHeadAttention(num_heads, d_model)
        self.feed_forward = FeedForwardLayer(d_model, d_ff)
        self.layer_norm1 = LayerNormalization()
        self.layer_norm2 = LayerNormalization()
        self.layer_norm3 = LayerNormalization()
        self.dropout1 = DropoutLayer(dropout_rate)
        self.dropout2 = DropoutLayer(dropout_rate)
        self.dropout3 = DropoutLayer(dropout_rate)

    def forward(self, inputs, encoder_output, look_ahead_mask=None, padding_mask=None, training=True):
        """Transformer decoder layer forward pass"""
        # Masked multi-head attention (self-attention)
        attention1, attention_weights_block1 = self.masked_multi_head_attention(
            inputs, inputs, inputs
        )
        attention1 = self.dropout1(attention1, training)
        output1 = self.layer_norm1(inputs + attention1)

        # Multi-head attention (encoder-decoder attention)
        attention2, attention_weights_block2 = self.multi_head_attention(
            output1, encoder_output, encoder_output
        )
        attention2 = self.dropout2(attention2, training)
        output2 = self.layer_norm2(output1 + attention2)

        # Feed forward
        ff_output = self.feed_forward(output2)
        ff_output = self.dropout3(ff_output, training)
        output3 = self.layer_norm3(output2 + ff_output)

        return output3, attention_weights_block1, attention_weights_block2
```

## API Design

### High-Level API

```python
# Python API for neural networks
class NeuralNetworkAPI:
    def __init__(self):
        self.models = {}

    def create_model(self, name, architecture):
        """Create neural network model"""
        builder = NeuralNetworkBuilder(name)

        for layer_config in architecture:
            layer_type = layer_config["type"]
            params = layer_config.get("params", {})

            if layer_type == "dense":
                builder.dense_layer(**params)
            elif layer_type == "conv":
                builder.convolutional_layer(**params)
            # ... other layer types

        model = builder.build()
        self.models[name] = model
        return model

    def train_model(self, model_name, data, config):
        """Train neural network model"""
        model = self.models[model_name]
        trainer = ModelTrainer(model)

        return trainer.fit(
            data["x_train"], data["y_train"],
            data.get("x_val"), data.get("y_val"),
            epochs=config.get("epochs", 10),
            batch_size=config.get("batch_size", 32),
            callbacks=config.get("callbacks", [])
        )
```

### KODEON Syntax Integration

```rust
// compiler/src/neural_network_integration.rs
pub struct NeuralNetworkCodeGenerator {
    pub fn generate_ml_ir(&self, ml_ast: &MLAST) -> MLIR {
        // Convert ML AST to intermediate representation
        MLIR::new()
    }

    pub fn compile_neural_network(&self, ml_ir: &MLIR) -> MLExecutable {
        // Compile to executable neural network
        MLExecutable::new()
    }
}

pub struct MLRuntime {
    pub fn execute_neural_network(&self, executable: &MLExecutable, data: &MLData) -> MLResults {
        // Execute neural network on data
        MLResults::new()
    }
}
```

## Integration with KODEON Core

### Standard Library Integration

```kodeon
// Neural network standard library functions
pustaka neural_networks:

    fungsi load_dataset(nama_dataset):
        // Load standard datasets
        jika nama_dataset == "mnist" maka:
            kembalikan muat_mnist()
        lainnya jika nama_dataset == "cifar10" maka:
            kembalikan muat_cifar10()
        // ... other datasets

    fungsi preprocess_data(data, metode):
        // Preprocess data using standard methods
        jika metode == "normalize" maka:
            kembalikan normalisasi(data)
        lainnya jika metode == "standardize" maka:
            kembalikan standarisasi(data)

    fungsi evaluate_model(model, test_data):
        // Evaluate model performance
        akurasi = model.hitung_akurasi(test_data.x, test_data.y)
        presisi = model.hitung_presisi(test_data.x, test_data.y)
        recall = model.hitung_recall(test_data.x, test_data.y)

        kembalikan {
            "accuracy": akurasi,
            "precision": presisi,
            "recall": recall
        }
```

## Performance Considerations

### Hardware Acceleration

- GPU support through CUDA/OpenCL
- TPU integration for Google Cloud
- CPU optimization with SIMD instructions
- Memory-efficient batch processing

### Optimization Techniques

```python
# neural_networks/optimization/optimizations.py
class ModelOptimizer:
    def __init__(self, model):
        self.model = model

    def quantize_weights(self, bits=8):
        """Quantize model weights to reduce memory usage"""
        for layer in self.model.layers:
            if hasattr(layer, 'weights'):
                layer.weights = self._quantize_array(layer.weights, bits)

    def prune_weights(self, threshold=0.01):
        """Prune small weights to reduce model size"""
        for layer in self.model.layers:
            if hasattr(layer, 'weights'):
                mask = np.abs(layer.weights) > threshold
                layer.weights = layer.weights * mask

    def fuse_layers(self):
        """Fuse compatible layers for better performance"""
        # Fuse batch normalization with convolutional layers
        # Fuse activation functions with linear layers
        pass
```

## Error Handling and Debugging

### ML-Specific Errors

```python
# neural_networks/errors.py
class NeuralNetworkError(Exception):
    pass

class ShapeMismatchError(NeuralNetworkError):
    pass

class ConvergenceError(NeuralNetworkError):
    pass

class OverfittingError(NeuralNetworkError):
    pass

class MLDebugInfo:
    def __init__(self, model, training_history):
        self.model = model
        self.training_history = training_history

    def detect_issues(self):
        """Detect common training issues"""
        issues = []

        # Check for overfitting
        if self._detect_overfitting():
            issues.append("Potential overfitting detected")

        # Check for vanishing gradients
        if self._detect_vanishing_gradients():
            issues.append("Vanishing gradients detected")

        # Check for exploding gradients
        if self._detect_exploding_gradients():
            issues.append("Exploding gradients detected")

        return issues
```

## Testing Strategy

### Unit Testing

```python
# neural_networks/tests/test_layers.py
import unittest
import numpy as np

class TestNeuralNetworkLayers(unittest.TestCase):
    def test_dense_layer_forward(self):
        """Test dense layer forward pass"""
        layer = DenseLayer(neurons=10, activation="relu")
        layer.build((None, 5))

        inputs = np.random.randn(32, 5)
        outputs = layer.forward(inputs)

        # Check output shape
        self.assertEqual(outputs.shape, (32, 10))

        # Check ReLU activation (no negative values)
        self.assertTrue(np.all(outputs >= 0))

    def test_convolutional_layer_shapes(self):
        """Test convolutional layer output shapes"""
        layer = ConvolutionalLayer(
            filters=32,
            kernel_size=(3, 3),
            padding="same"
        )
        layer.build((None, 28, 28, 1))

        inputs = np.random.randn(16, 28, 28, 1)
        outputs = layer.forward(inputs)

        # Check output shape
        self.assertEqual(outputs.shape, (16, 28, 28, 32))
```

### Integration Testing

- Test complete model training workflows
- Validate neural network architectures
- Verify hardware acceleration integration
- Check model serialization and loading

## Security Considerations

### Model Security

- Protection against adversarial attacks
- Secure model serialization
- Privacy-preserving training techniques
- Model watermarking for IP protection

### Data Privacy

- Federated learning support
- Differential privacy integration
- Secure multi-party computation
- Encrypted model inference

## Future Extensions

### Advanced ML Features

- AutoML capabilities for architecture search
- Neural architecture search (NAS)
- Meta-learning frameworks
- Few-shot learning techniques

### Research Areas

- Quantum machine learning integration
- Neuromorphic computing support
- Brain-computer interface ML
- Explainable AI (XAI) frameworks
