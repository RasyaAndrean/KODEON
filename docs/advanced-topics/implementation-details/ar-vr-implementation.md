# KODEON AR/VR Implementation

This document provides detailed technical specifications for implementing augmented reality (AR) and virtual reality (VR) capabilities in the KODEON programming language, enabling developers to create immersive 3D experiences with intuitive natural language syntax.

## Architecture Overview

The AR/VR module follows a component-based architecture that abstracts the complexity of 3D graphics and spatial computing while providing powerful customization options:

```
┌─────────────────────────────────────────────────────────────┐
│              KODEON AR/VR Syntax                            │
├─────────────────────────────────────────────────────────────┤
│           Scene Graph & Entity Component System             │
├─────────────────────────────────────────────────────────────┤
│        3D Rendering Engine                                  │
├─────────────────────────────────────────────────────────────┤
│         Physics Engine                                      │
├─────────────────────────────────────────────────────────────┤
│       Input & Interaction Management                        │
├─────────────────────────────────────────────────────────────┤
│    Spatial Computing & Tracking                             │
├─────────────────────────────────────────────────────────────┤
│    Graphics APIs (WebGL/Vulkan/OpenGL/Metal)                │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. AR/VR Scene Definition

#### Scene Creation

```kodeon
// AR/VR scene definition in KODEON
buat scene_3d "virtual_museum":
    // Environment settings
    environment:
        background_color = "#222222"
        ambient_light = (0.3, 0.3, 0.3)
        fog = {
            "type": "linear",
            "near": 10,
            "far": 100,
            "color": "#888888"
        }

    // Camera configuration
    kamera:
        position = (0, 1.6, 5)
        rotation = (0, 0, 0)
        field_of_view = 75
        near_plane = 0.1
        far_plane = 1000

    // Lighting
    cahaya "main_light":
        jenis = directional_light
        position = (5, 10, 7)
        color = "#ffffff"
        intensity = 1.0

    cahaya "spot_light":
        jenis = spot_light
        position = (0, 5, 0)
        target = (0, 0, 0)
        color = "#ffaa33"
        intensity = 0.8
        angle = 45
        penumbra = 0.2
```

#### 3D Object Management

```kodeon
// 3D object creation and manipulation
objek_3d "museum_entrance":
    model = "models/entrance.glb"
    position = (0, 0, 0)
    rotation = (0, 0, 0)
    scale = (1, 1, 1)

    // Material properties
    material:
        color = "#cccccc"
        roughness = 0.5
        metalness = 0.2
        texture = "textures/entrance_diffuse.jpg"
        normal_map = "textures/entrance_normal.jpg"

    // Animation
    animasi:
        idle = {
            "clip": "animations/idle.fbx",
            "loop": true,
            "speed": 1.0
        }

    // Interaction handlers
    saat diklik:
        tampilkan informasi("Selamat datang di Museum Virtual!")
        mainkan_suara("sounds/welcome.mp3")

    saat hover:
        ubah warna("#ffff00")

    saat drag:
        posisi = posisi_mouse_3d()
```

### 2. Entity Component System

#### ECS Implementation

```python
# ar_vr/ecs/entity_manager.py
class EntityManager:
    def __init__(self):
        self.entities = {}
        self.components = {}
        self.systems = []

    def create_entity(self, name=None):
        """Create a new entity"""
        entity_id = self._generate_entity_id()
        self.entities[entity_id] = {
            "name": name or f"Entity_{entity_id}",
            "components": set(),
            "active": True
        }
        return entity_id

    def add_component(self, entity_id, component_type, component_data):
        """Add component to entity"""
        if entity_id not in self.entities:
            raise EntityNotFoundError(f"Entity {entity_id} not found")

        # Store component data
        if component_type not in self.components:
            self.components[component_type] = {}

        self.components[component_type][entity_id] = component_data
        self.entities[entity_id]["components"].add(component_type)

    def get_component(self, entity_id, component_type):
        """Get component data for entity"""
        if component_type in self.components:
            return self.components[component_type].get(entity_id)
        return None

    def add_system(self, system):
        """Add system to entity manager"""
        self.systems.append(system)

    def update(self, delta_time):
        """Update all systems"""
        for system in self.systems:
            system.update(delta_time, self)
```

#### Core Components

```python
# ar_vr/ecs/components.py
class TransformComponent:
    def __init__(self, position=(0, 0, 0), rotation=(0, 0, 0), scale=(1, 1, 1)):
        self.position = list(position)
        self.rotation = list(rotation)
        self.scale = list(scale)
        self.world_matrix = None
        self.dirty = True

    def set_position(self, x, y, z):
        self.position = [x, y, z]
        self.dirty = True

    def set_rotation(self, x, y, z):
        self.rotation = [x, y, z]
        self.dirty = True

    def set_scale(self, x, y, z):
        self.scale = [x, y, z]
        self.dirty = True

class RenderComponent:
    def __init__(self, mesh=None, material=None, visible=True):
        self.mesh = mesh
        self.material = material
        self.visible = visible
        self.cast_shadow = True
        self.receive_shadow = True

class PhysicsComponent:
    def __init__(self, mass=0, shape="box", friction=0.5, restitution=0.3):
        self.mass = mass
        self.shape = shape
        self.friction = friction
        self.restitution = restitution
        self.velocity = [0, 0, 0]
        self.angular_velocity = [0, 0, 0]
        self.sleeping = False

class InteractionComponent:
    def __init__(self):
        self.clickable = True
        self.hoverable = True
        self.draggable = False
        self.callbacks = {
            "onClick": None,
            "onHover": None,
            "onDrag": None,
            "onDrop": None
        }
```

### 3. 3D Rendering Engine

#### Renderer Implementation

```python
# ar_vr/rendering/renderer.py
class Renderer:
    def __init__(self, width, height):
        self.width = width
        self.height = height
        self.camera = None
        self.scene = None
        self.render_targets = {}

    def initialize(self):
        """Initialize graphics context"""
        # Initialize WebGL/Vulkan context
        self.graphics_context = self._create_graphics_context()

        # Create default render targets
        self.render_targets["main"] = self._create_render_target(
            self.width, self.height
        )

        # Initialize shaders
        self.shader_manager = ShaderManager()
        self._load_default_shaders()

    def render_frame(self, scene, camera):
        """Render a single frame"""
        # Clear render target
        self._clear_render_target()

        # Update camera matrices
        camera.update_matrices()

        # Render scene objects
        for entity in scene.get_entities_with_component("RenderComponent"):
            self._render_entity(entity, camera)

        # Render UI elements
        self._render_ui()

        # Present frame
        self._present_frame()

    def _render_entity(self, entity, camera):
        """Render a single entity"""
        transform = entity.get_component("TransformComponent")
        render = entity.get_component("RenderComponent")

        if not render.visible:
            return

        # Calculate world matrix
        if transform.dirty:
            transform.world_matrix = self._calculate_world_matrix(transform)
            transform.dirty = False

        # Bind shader
        shader = self.shader_manager.get_shader("pbr")
        shader.bind()

        # Set shader uniforms
        shader.set_uniform("u_modelMatrix", transform.world_matrix)
        shader.set_uniform("u_viewMatrix", camera.view_matrix)
        shader.set_uniform("u_projectionMatrix", camera.projection_matrix)

        # Bind textures and materials
        if render.material:
            self._bind_material(render.material, shader)

        # Render mesh
        if render.mesh:
            render.mesh.draw()
```

#### Shader Management

```python
# ar_vr/rendering/shaders.py
class ShaderManager:
    def __init__(self):
        self.shaders = {}
        self.current_shader = None

    def load_shader(self, name, vertex_source, fragment_source):
        """Load and compile shader program"""
        shader_program = self._compile_shader(vertex_source, fragment_source)
        self.shaders[name] = shader_program
        return shader_program

    def get_shader(self, name):
        """Get shader program by name"""
        return self.shaders.get(name)

    def _compile_shader(self, vertex_source, fragment_source):
        """Compile vertex and fragment shaders"""
        # Create shader objects
        vertex_shader = self._create_shader(GL_VERTEX_SHADER, vertex_source)
        fragment_shader = self._create_shader(GL_FRAGMENT_SHADER, fragment_source)

        # Create program
        program = glCreateProgram()

        # Attach shaders
        glAttachShader(program, vertex_shader)
        glAttachShader(program, fragment_shader)

        # Link program
        glLinkProgram(program)

        # Check for linking errors
        if not self._check_program_link_status(program):
            raise ShaderCompilationError("Failed to link shader program")

        return program

class PBRShader:
    def __init__(self):
        self.vertex_source = """
            #version 300 es
            precision highp float;

            in vec3 a_position;
            in vec3 a_normal;
            in vec2 a_uv;

            uniform mat4 u_modelMatrix;
            uniform mat4 u_viewMatrix;
            uniform mat4 u_projectionMatrix;

            out vec3 v_worldPos;
            out vec3 v_normal;
            out vec2 v_uv;

            void main() {
                vec4 worldPos = u_modelMatrix * vec4(a_position, 1.0);
                v_worldPos = worldPos.xyz;
                v_normal = mat3(u_modelMatrix) * a_normal;
                v_uv = a_uv;

                gl_Position = u_projectionMatrix * u_viewMatrix * worldPos;
            }
        """

        self.fragment_source = """
            #version 300 es
            precision highp float;

            in vec3 v_worldPos;
            in vec3 v_normal;
            in vec2 v_uv;

            uniform vec3 u_lightPosition;
            uniform vec3 u_lightColor;
            uniform vec3 u_cameraPosition;

            uniform vec3 u_albedo;
            uniform float u_metallic;
            uniform float u_roughness;

            out vec4 outColor;

            // PBR functions would be implemented here
            vec3 calculatePBR(vec3 albedo, float metallic, float roughness,
                             vec3 normal, vec3 viewDir, vec3 lightDir, vec3 lightColor) {
                // Simplified PBR calculation
                // Full implementation would include BRDF, lighting models, etc.
                return albedo * lightColor * max(dot(normal, lightDir), 0.0);
            }

            void main() {
                vec3 normal = normalize(v_normal);
                vec3 viewDir = normalize(u_cameraPosition - v_worldPos);
                vec3 lightDir = normalize(u_lightPosition - v_worldPos);

                vec3 color = calculatePBR(
                    u_albedo, u_metallic, u_roughness,
                    normal, viewDir, lightDir, u_lightColor
                );

                outColor = vec4(color, 1.0);
            }
        """
```

### 4. Physics Engine

#### Physics Simulation

```python
# ar_vr/physics/physics_engine.py
class PhysicsEngine:
    def __init__(self):
        self.bodies = {}
        self.constraints = []
        self.gravity = [0, -9.81, 0]
        self.time_step = 1.0 / 60.0

    def add_rigid_body(self, entity_id, mass, shape, position=(0, 0, 0)):
        """Add rigid body to physics simulation"""
        body = RigidBody(entity_id, mass, shape, position)
        self.bodies[entity_id] = body
        return body

    def add_constraint(self, constraint):
        """Add constraint between bodies"""
        self.constraints.append(constraint)

    def simulate(self, delta_time):
        """Run physics simulation"""
        # Update at fixed time step
        steps = int(delta_time / self.time_step)

        for _ in range(steps):
            self._integrate_bodies()
            self._solve_constraints()
            self._detect_collisions()
            self._resolve_collisions()

    def _integrate_bodies(self):
        """Integrate body positions and velocities"""
        for body in self.bodies.values():
            if body.mass > 0:  # Dynamic body
                # Apply gravity
                body.apply_force(self.gravity)

                # Integrate velocity
                body.velocity[0] += body.force[0] / body.mass * self.time_step
                body.velocity[1] += body.force[1] / body.mass * self.time_step
                body.velocity[2] += body.force[2] / body.mass * self.time_step

                # Integrate position
                body.position[0] += body.velocity[0] * self.time_step
                body.position[1] += body.velocity[1] * self.time_step
                body.position[2] += body.velocity[2] * self.time_step

                # Reset forces
                body.force = [0, 0, 0]
```

#### Collision Detection

```python
# ar_vr/physics/collision.py
class CollisionDetector:
    def __init__(self):
        self.broadphase = Broadphase()
        self.narrowphase = Narrowphase()

    def detect_collisions(self, bodies):
        """Detect collisions between bodies"""
        # Broadphase - quickly eliminate distant objects
        potential_pairs = self.broadphase.find_potential_collisions(bodies)

        # Narrowphase - precise collision detection
        collisions = []
        for body_a, body_b in potential_pairs:
            collision = self.narrowphase.detect_collision(body_a, body_b)
            if collision:
                collisions.append(collision)

        return collisions

    def resolve_collisions(self, collisions):
        """Resolve collision responses"""
        for collision in collisions:
            # Calculate impulse
            impulse = self._calculate_impulse(collision)

            # Apply impulse to bodies
            collision.body_a.apply_impulse(
                impulse, collision.contact_point
            )
            collision.body_b.apply_impulse(
                [-i for i in impulse], collision.contact_point
            )

class AABB:
    def __init__(self, min_point, max_point):
        self.min = list(min_point)
        self.max = list(max_point)

    def intersects(self, other):
        """Check if this AABB intersects with another"""
        return (self.min[0] <= other.max[0] and self.max[0] >= other.min[0] and
                self.min[1] <= other.max[1] and self.max[1] >= other.min[1] and
                self.min[2] <= other.max[2] and self.max[2] >= other.min[2])
```

## Implementation Phases

### Phase 1: Foundation (Months 1-4)

#### Month 1: AR/VR Syntax and Parser

##### AR/VR Keywords Implementation

- Add AR/VR keywords to lexer
- Implement 3D scene syntax parsing
- Create AST nodes for 3D operations
- Add spatial computing keywords

##### Lexer Extensions

```rust
// compiler/src/lexer.rs
pub enum TokenKind {
    // ... existing tokens ...

    // AR/VR keywords
    SCENE_3D,       // scene_3d
    OBJEK_3D,       // objek_3d
    KAMERA,         // camera
    CAHAYA,         // light
    MATERIAL,       // material
    TEKSUR,         // texture
    ANIMASI,        // animation
    FISIKA,         // physics
    INTERAKSI,      // interaction
    REALITAS_TERAUGMENTASI,  // augmented_reality
    REALITAS_VIRTUAL,        // virtual_reality

    // 3D properties
    POSISI,         // position
    ROTASI,         // rotation
    SKALA,          // scale
    MODEL,          // model
    WARNA,          // color
    TEKSTUR,        // texture
}
```

##### Parser Extensions

```rust
// compiler/src/parser.rs
pub enum ARVRStatement {
    SceneDefinition {
        name: String,
        properties: SceneProperties,
        entities: Vec<EntityDefinition>,
    },
    EntityDefinition {
        name: String,
        entity_type: String,
        properties: EntityProperties,
        components: Vec<ComponentDefinition>,
    },
    ComponentDefinition {
        component_type: String,
        properties: HashMap<String, Expression>,
    },
}

pub struct SceneProperties {
    pub environment: Option<EnvironmentConfig>,
    pub camera: Option<CameraConfig>,
    pub lights: Vec<LightConfig>,
}
```

#### Month 2: Entity Component System

##### Core ECS Implementation

```python
# ar_vr/ecs/core.py
class ECSManager:
    def __init__(self):
        self.entity_manager = EntityManager()
        self.component_manager = ComponentManager()
        self.system_manager = SystemManager()

    def create_scene(self, name):
        """Create a new 3D scene"""
        scene_entity = self.entity_manager.create_entity(name)
        self.component_manager.add_component(
            scene_entity, "SceneComponent", {"name": name}
        )
        return scene_entity

    def create_object(self, scene, name, object_type="mesh"):
        """Create a 3D object in scene"""
        obj_entity = self.entity_manager.create_entity(name)

        # Add to scene
        scene_component = self.component_manager.get_component(scene, "SceneComponent")
        if scene_component:
            if "objects" not in scene_component:
                scene_component["objects"] = []
            scene_component["objects"].append(obj_entity)

        # Add basic components
        self.component_manager.add_component(
            obj_entity, "TransformComponent", TransformComponent()
        )

        if object_type == "mesh":
            self.component_manager.add_component(
                obj_entity, "RenderComponent", RenderComponent()
            )

        return obj_entity

    def update(self, delta_time):
        """Update ECS systems"""
        self.system_manager.update(delta_time, self.entity_manager)
```

#### Month 3: Basic Rendering

##### WebGL Renderer Implementation

```python
# ar_vr/rendering/webgl_renderer.py
class WebGLRenderer:
    def __init__(self, canvas_element):
        self.canvas = canvas_element
        self.gl = None
        self.initialized = False

    def initialize(self):
        """Initialize WebGL context"""
        try:
            self.gl = self.canvas.getContext("webgl2") or self.canvas.getContext("webgl")
            if not self.gl:
                raise RuntimeError("WebGL not supported")

            self.initialized = True

            # Set default WebGL state
            self.gl.enable(self.gl.DEPTH_TEST)
            self.gl.enable(self.gl.CULL_FACE)
            self.gl.cullFace(self.gl.BACK)

            # Initialize buffers and shaders
            self._initialize_buffers()
            self._initialize_shaders()

        except Exception as e:
            raise RuntimeError(f"Failed to initialize WebGL: {e}")

    def render_scene(self, scene):
        """Render 3D scene"""
        if not self.initialized:
            raise RuntimeError("Renderer not initialized")

        # Clear frame buffer
        self.gl.clearColor(0.0, 0.0, 0.0, 1.0)
        self.gl.clear(self.gl.COLOR_BUFFER_BIT | self.gl.DEPTH_BUFFER_BIT)

        # Render all objects in scene
        objects = self._get_scene_objects(scene)
        for obj in objects:
            self._render_object(obj)

    def _render_object(self, obj):
        """Render a single 3D object"""
        # Get components
        transform = obj.get_component("TransformComponent")
        render = obj.get_component("RenderComponent")

        if not render or not render.visible:
            return

        # Bind shader program
        shader = self._get_shader(render.material.shader_type)
        self.gl.useProgram(shader.program)

        # Set uniforms
        self._set_transform_uniforms(shader, transform)
        self._set_material_uniforms(shader, render.material)

        # Bind vertex buffers
        self._bind_vertex_buffers(render.mesh)

        # Draw
        self.gl.drawElements(
            self.gl.TRIANGLES,
            render.mesh.index_count,
            self.gl.UNSIGNED_SHORT,
            0
        )
```

#### Month 4: Input and Interaction

##### Input Management

```kodeon
// AR/VR interaction handlers
objek_3d "interactive_cube":
    model = "models/cube.obj"
    position = (0, 0, 0)

    interaksi:
        saat diklik(posisi, tombol):
            jika tombol == "kiri" maka:
                putar(0, 45, 0)
                ubah warna("#ff0000")
            lainnya jika tombol == "kanan" maka:
                skala = skala * 1.2
                ubah warna("#00ff00")

        saat hover(masuk):
            jika masuk maka:
                tambah cahaya_emissive(0.5)
            lainnya:
                kurangi cahaya_emissive(0.5)

        saat drag(posisi_awal, posisi_akhir):
            delta = posisi_akhir - posisi_awal
            geser(delta.x, 0, delta.y)

        saat gesture(nama_gesture):
            jika nama_gesture == "swipe_up" maka:
                lompat(5)
            lainnya jika nama_gesture == "pinch" maka:
                skala = skala * 1.1
```

```python
# ar_vr/input/input_manager.py
class InputManager:
    def __init__(self):
        self.event_listeners = {}
        self.gesture_recognizers = {}
        self.pointer_position = [0, 0]
        self.pointer_down = False

    def add_event_listener(self, event_type, callback):
        """Add event listener for input events"""
        if event_type not in self.event_listeners:
            self.event_listeners[event_type] = []
        self.event_listeners[event_type].append(callback)

    def handle_mouse_event(self, event_type, x, y, button=None):
        """Handle mouse/touch events"""
        self.pointer_position = [x, y]

        if event_type == "mousedown":
            self.pointer_down = True
        elif event_type == "mouseup":
            self.pointer_down = False

        # Raycast to find 3D object under pointer
        hit_object = self._raycast_to_object(x, y)

        if hit_object:
            # Trigger object interaction events
            self._trigger_interaction_event(hit_object, event_type, x, y, button)

    def _raycast_to_object(self, x, y):
        """Cast ray from camera through pointer to find intersecting objects"""
        # Convert screen coordinates to normalized device coordinates
        ndc_x = (2.0 * x) / self.viewport_width - 1.0
        ndc_y = 1.0 - (2.0 * y) / self.viewport_height

        # Create ray in world space
        ray_origin, ray_direction = self._screen_to_world_ray(ndc_x, ndc_y)

        # Test intersection with scene objects
        closest_hit = None
        closest_distance = float('inf')

        for obj in self.scene.get_interactive_objects():
            hit = self._intersect_ray_with_object(
                ray_origin, ray_direction, obj
            )
            if hit and hit.distance < closest_distance:
                closest_hit = obj
                closest_distance = hit.distance

        return closest_hit

    def _trigger_interaction_event(self, obj, event_type, x, y, button=None):
        """Trigger interaction event on object"""
        interaction_component = obj.get_component("InteractionComponent")
        if not interaction_component:
            return

        # Map event type to callback
        callback_map = {
            "mousedown": interaction_component.callbacks.get("onClick"),
            "mousemove": interaction_component.callbacks.get("onHover"),
            "mouseup": interaction_component.callbacks.get("onDrop")
        }

        callback = callback_map.get(event_type)
        if callback:
            callback(x, y, button)
```

### Phase 2: Advanced Features (Months 5-8)

#### Month 5: Physics and Animation

##### Animation System

```kodeon
// Advanced animation system
objek_3d "animated_character":
    model = "models/character.fbx"
    animasi:
        idle = {
            "clip": "animations/idle.fbx",
            "loop": true,
            "speed": 1.0
        }
        walk = {
            "clip": "animations/walk.fbx",
            "loop": true,
            "speed": 1.5
        }
        jump = {
            "clip": "animations/jump.fbx",
            "loop": false,
            "speed": 1.0
        }

    // Animation blending
    saat keyboard("W") ditekan:
        animasi = transisi_ke("walk", durasi=0.3)

    saat keyboard("SPACE") ditekan:
        animasi = transisi_ke("jump", durasi=0.1)
        fisika.impuls(0, 10, 0)

    saat keyboard("W") dilepas:
        animasi = transisi_ke("idle", durasi=0.5)
```

```python
# ar_vr/animation/animation_system.py
class AnimationSystem:
    def __init__(self):
        self.animations = {}
        self.blend_trees = {}
        self.active_animations = {}

    def load_animation_clip(self, name, file_path):
        """Load animation clip from file"""
        clip = AnimationClip.load_from_file(file_path)
        self.animations[name] = clip
        return clip

    def play_animation(self, entity, clip_name, loop=True, speed=1.0):
        """Play animation on entity"""
        if clip_name not in self.animations:
            raise AnimationNotFoundError(f"Animation {clip_name} not found")

        animation_state = AnimationState(
            self.animations[clip_name],
            loop=loop,
            speed=speed
        )

        self.active_animations[entity] = animation_state
        return animation_state

    def blend_animations(self, entity, from_clip, to_clip, blend_duration):
        """Blend between two animations"""
        blend_tree = BlendTree(from_clip, to_clip, blend_duration)
        self.blend_trees[entity] = blend_tree

    def update(self, delta_time):
        """Update all active animations"""
        for entity, animation_state in self.active_animations.items():
            animation_state.update(delta_time)

            # Apply bone transformations to entity
            self._apply_bone_transforms(entity, animation_state)
```

#### Month 6: Advanced Lighting and Materials

##### PBR Material System

```kodeon
// Physically Based Rendering materials
objek_3d "metal_sphere":
    model = "models/sphere.obj"
    material:
        jenis = "pbr"
        albedo = "#c0c0c0"  // Base color
        metallic = 1.0      // Fully metallic
        roughness = 0.1     // Very smooth
        normal_map = "textures/metal_normal.png"
        ao_map = "textures/metal_ao.png"
        emissive = "#000000"

    // Environment reflections
    environment:
        reflection_intensity = 0.8
        reflection_blur = 0.2

objek_3d "wooden_table":
    model = "models/table.obj"
    material:
        jenis = "pbr"
        albedo = "#8B4513"  // Brown wood color
        metallic = 0.0      // Non-metallic
        roughness = 0.7     // Rough surface
        normal_map = "textures/wood_normal.png"
        displacement_map = "textures/wood_height.png"
```

```python
# ar_vr/rendering/pbr_materials.py
class PBRMaterial:
    def __init__(self, albedo=(1, 1, 1), metallic=0.0, roughness=0.5):
        self.albedo = list(albedo)
        self.metallic = metallic
        self.roughness = roughness
        self.normal_map = None
        self.ao_map = None
        self.emissive = (0, 0, 0)
        self.displacement_map = None

        # Textures
        self.textures = {}

    def set_texture(self, texture_type, texture):
        """Set texture for material property"""
        self.textures[texture_type] = texture

    def get_shader_uniforms(self):
        """Get uniform values for PBR shader"""
        return {
            "u_albedo": self.albedo,
            "u_metallic": self.metallic,
            "u_roughness": self.roughness,
            "u_emissive": self.emissive
        }

class IBLRenderer:
    def __init__(self):
        self.environment_map = None
        self.irradiance_map = None
        self.prefilter_map = None
        self.brdf_lut = None

    def load_environment_map(self, file_path):
        """Load environment map for image-based lighting"""
        self.environment_map = Texture.load_hdr(file_path)
        self._generate_irradiance_map()
        self._generate_prefilter_map()
        self._generate_brdf_lut()

    def _generate_irradiance_map(self):
        """Generate irradiance map from environment map"""
        # Implementation would use convolution shaders
        pass

    def _generate_prefilter_map(self):
        """Generate prefiltered environment map"""
        # Implementation would generate mipmaps with different roughness levels
        pass
```

#### Month 7: Audio System

##### 3D Audio Implementation

```kodeon
// 3D audio system
objek_3d "music_player":
    model = "models/speaker.obj"
    posisi = (5, 0, 0)

    audio:
        sumber = "sounds/ambient_music.mp3"
        jenis = "3d"
        posisi = (5, 0, 0)
        volume = 0.8
        loop = true
        rolloff_factor = 1.0
        ref_distance = 1.0
        max_distance = 100.0

    saat diklik:
        jika audio.sedang_dimainkan maka:
            audio.hentikan()
        lainnya:
            audio.mainkan()

    saat hover:
        audio.volume = 1.0

    saat drag:
        audio.posisi = posisi_objek()
```

```python
# ar_vr/audio/audio_system.py
class AudioSystem:
    def __init__(self):
        self.audio_context = self._create_audio_context()
        self.sources = {}
        self.listeners = {}

    def create_3d_source(self, name, file_path, position=(0, 0, 0)):
        """Create 3D audio source"""
        buffer = self._load_audio_buffer(file_path)
        source = self.audio_context.createBufferSource()
        source.buffer = buffer

        # Create panner for 3D positioning
        panner = self.audio_context.createPanner()
        panner.panningModel = "HRTF"
        panner.distanceModel = "inverse"
        panner.setPosition(position[0], position[1], position[2])

        # Connect nodes
        source.connect(panner)
        panner.connect(self.audio_context.destination)

        audio_source = AudioSource(source, panner, buffer)
        self.sources[name] = audio_source
        return audio_source

    def set_listener_position(self, x, y, z):
        """Set listener position for 3D audio"""
        self.audio_context.listener.setPosition(x, y, z)

    def set_listener_orientation(self, forward_x, forward_y, forward_z,
                               up_x, up_y, up_z):
        """Set listener orientation"""
        self.audio_context.listener.setOrientation(
            forward_x, forward_y, forward_z,
            up_x, up_y, up_z
        )
```

#### Month 8: Particle Systems

##### Particle Effects

```kodeon
// Particle system effects
efek_partikel "fire_effect":
    emisi:
        laju = 100  // particles per second
        durasi = -1  // infinite
        bentuk = "sphere"
        radius = 0.1

    partikel:
        ukuran_awal = 0.1
        ukuran_akhir = 0.0
        warna_awal = "#ff4500"
        warna_akhir = "#ffa50000"  // transparent orange
        lifetime = 2.0  // seconds
        kecepatan_awal = {
            "min": (0, 2, 0),
            "max": (0.5, 5, 0.5)
        }
        gravitasi = (0, -9.8, 0)

    material:
        jenis = "additive"
        tekstur = "textures/fire_particle.png"

objek_3d "campfire":
    model = "models/campfire.obj"
    posisi = (0, 0, 0)

    // Attach particle effect
    tambah_efek "fire_effect" dengan:
        posisi = (0, 0.5, 0)
        rotasi = (90, 0, 0)  // face upward
```

```python
# ar_vr/particles/particle_system.py
class ParticleSystem:
    def __init__(self, max_particles=1000):
        self.max_particles = max_particles
        self.particles = []
        self.emitters = []
        self.material = None
        self.active = True

    def add_emitter(self, emitter):
        """Add particle emitter"""
        self.emitters.append(emitter)

    def update(self, delta_time):
        """Update particle system"""
        if not self.active:
            return

        # Update existing particles
        for particle in self.particles[:]:
            particle.life -= delta_time
            if particle.life <= 0:
                self.particles.remove(particle)
                continue

            # Update particle position
            particle.position[0] += particle.velocity[0] * delta_time
            particle.position[1] += particle.velocity[1] * delta_time
            particle.position[2] += particle.velocity[2] * delta_time

            # Apply forces (gravity, etc.)
            particle.velocity[1] += particle.gravity * delta_time

            # Update particle properties
            particle.size = self._interpolate(
                particle.initial_size, particle.final_size,
                particle.life_ratio
            )
            particle.color = self._interpolate_color(
                particle.initial_color, particle.final_color,
                particle.life_ratio
            )

        # Emit new particles
        for emitter in self.emitters:
            self._emit_particles(emitter, delta_time)

    def _emit_particles(self, emitter, delta_time):
        """Emit particles from emitter"""
        particles_to_emit = int(emitter.rate * delta_time)

        for _ in range(particles_to_emit):
            if len(self.particles) >= self.max_particles:
                break

            particle = self._create_particle(emitter)
            self.particles.append(particle)

    def _create_particle(self, emitter):
        """Create a new particle"""
        particle = Particle()

        # Set initial properties from emitter
        particle.position = emitter.position.copy()
        particle.velocity = self._random_vector(
            emitter.velocity_min, emitter.velocity_max
        )
        particle.life = emitter.particle_lifetime
        particle.initial_size = emitter.initial_size
        particle.final_size = emitter.final_size
        particle.initial_color = emitter.initial_color
        particle.final_color = emitter.final_color
        particle.gravity = emitter.gravity

        return particle
```

### Phase 3: AR/VR Specific Features (Months 9-12)

#### Month 9: Augmented Reality

##### AR Implementation

```kodeon
// Augmented Reality scene
buat realitas_teraugmentasi "furniture_preview":
    // AR tracking configuration
    tracking:
        jenis = "plane_detection"
        plane_types = ["horizontal", "vertical"]
        feature_points = true

    // AR session configuration
    sesi:
        mode = "immersive-ar"
        required_features = ["hit-test", "dom-overlay"]
        optional_features = ["light-estimation"]

    // Virtual objects
    objek_3d "furniture_model":
        model = "models/sofa.glb"
        skala = (1, 1, 1)
        visible = false  // Initially hidden

        saat tap(position):
            jika belum_ditempatkan maka:
                tempatkan_di_permukaan(position)
                visible = true
                animasi = "appear"

        saat drag(position):
            pindahkan_ke_posisi(position)

        saat rotate(gesture):
            rotasi_y = rotasi_y + gesture.delta_rotation

        saat scale(gesture):
            skala = skala * gesture.scale_factor

    // UI overlay
    ui_overlay:
        type = "dom-overlay"
        html = "
            <div id='ar-controls'>
                <button id='rotate-btn'>Rotate</button>
                <button id='scale-btn'>Scale</button>
                <button id='buy-btn'>Buy Now</button>
            </div>
        "
```

```python
# ar_vr/ar/augmented_reality.py
class ARSession:
    def __init__(self):
        self.session = None
        self.tracking_state = "not_started"
        self.detected_planes = []
        self.feature_points = []
        self.light_estimator = LightEstimator()

    def start_session(self, configuration):
        """Start AR session with configuration"""
        try:
            # Initialize WebXR session
            self.session = self._create_webxr_session(configuration)

            # Set up event listeners
            self.session.addEventListener(
                "planeschanged", self._on_planes_changed
            )
            self.session.addEventListener(
                "trackedplaneschanged", self._on_tracked_planes_changed
            )

            # Start tracking
            self.tracking_state = "running"

        except Exception as e:
            self.tracking_state = "error"
            raise ARError(f"Failed to start AR session: {e}")

    def hit_test(self, x, y):
        """Perform hit test at screen coordinates"""
        if not self.session:
            return None

        # Convert screen coordinates to normalized device coordinates
        ndc_x = (2.0 * x) / self.viewport_width - 1.0
        ndc_y = 1.0 - (2.0 * y) / self.viewport_height

        # Perform hit test
        hit_results = self.session.hitTest(ndc_x, ndc_y)

        if hit_results and len(hit_results) > 0:
            return ARHitResult(
                position=hit_results[0].getPosition(),
                rotation=hit_results[0].getRotation(),
                plane=hit_results[0].getPlane()
            )

        return None

    def _on_planes_changed(self, event):
        """Handle plane detection events"""
        self.detected_planes = event.planes
```

#### Month 10: Virtual Reality

##### VR Implementation

```kodeon
// Virtual Reality scene
buat realitas_virtual "virtual_meeting_room":
    // VR session configuration
    sesi:
        mode = "immersive-vr"
        required_features = ["hand-tracking", "layers"]
        optional_features = ["eye-tracking"]

    // VR camera (headset)
    kamera:
        jenis = "vr"
        position = (0, 1.6, 0)  // Average eye height
        ipd = 0.064  // Inter-pupillary distance

    // VR controllers
    controller "left_hand":
        handedness = "left"
        pointer = true

        saat trigger_ditekan:
            objek_dipilih = raycast_controller()
            jika objek_dipilih maka:
                pegang(objek_dipilih)

        saat trigger_dilepas:
            lepas()

        saat grip_ditekan:
            mode = "grab"

        saat grip_dilepas:
            mode = "point"

    controller "right_hand":
        handedness = "right"
        pointer = true

        saat menu_ditekan:
            tampilkan_menu("main_menu")

        saat thumbstick_digunakan(arah):
            jika arah == "atas" maka:
                teleport_ke(posisi_depan())
            lainnya jika arah == "bawah" maka:
                reset_posisi()

    // VR UI
    ui_3d "vr_interface":
        type = "curved"
        radius = 2.0
        segments = 32

        panel "main_menu":
            position = (0, 1.5, -1)
            buttons = [
                {"text": "Settings", "action": "open_settings"},
                {"text": "Participants", "action": "show_participants"},
                {"text": "Share Screen", "action": "share_screen"}
            ]
```

```python
# ar_vr/vr/virtual_reality.py
class VRSession:
    def __init__(self):
        self.session = None
        self.viewer_space = None
        self.controller_poses = {}
        self.reference_space = None

    def start_session(self, configuration):
        """Start VR session"""
        try:
            # Initialize WebXR VR session
            self.session = self._create_webxr_session(
                "immersive-vr", configuration
            )

            # Create reference space
            self.reference_space = self.session.requestReferenceSpace(
                "local-floor"
            )

            # Set up input sources
            self.session.addEventListener(
                "inputsourceschange", self._on_input_sources_change
            )

            # Set up frame loop
            self.session.requestAnimationFrame(self._on_frame)

        except Exception as e:
            raise VRError(f"Failed to start VR session: {e}")

    def _on_frame(self, time, frame):
        """Handle VR frame update"""
        # Get viewer pose
        viewer_pose = frame.getViewerPose(self.reference_space)
        if viewer_pose:
            self._update_camera_from_pose(viewer_pose)

        # Update controller poses
        for input_source in self.session.inputSources:
            if input_source.targetRaySpace:
                target_ray_pose = frame.getPose(
                    input_source.targetRaySpace, self.reference_space
                )
                if target_ray_pose:
                    self.controller_poses[input_source.handedness] = target_ray_pose

        # Continue frame loop
        self.session.requestAnimationFrame(self._on_frame)

    def _update_camera_from_pose(self, viewer_pose):
        """Update camera from viewer pose"""
        if len(viewer_pose.views) >= 2:
            # Stereo rendering
            left_view = viewer_pose.views[0]
            right_view = viewer_pose.views[1]

            # Update camera matrices for stereo rendering
            self.camera.set_stereo_matrices(
                left_view.projectionMatrix,
                left_view.transform.matrix,
                right_view.projectionMatrix,
                right_view.transform.matrix
            )
```

#### Month 11: Spatial Audio and Haptics

##### Spatial Audio Implementation

```python
# ar_vr/audio/spatial_audio.py
class SpatialAudioSystem:
    def __init__(self):
        self.audio_context = self._create_spatial_audio_context()
        self.sources = {}
        self.reverb_zones = {}

    def create_spatial_source(self, name, audio_buffer, position=(0, 0, 0)):
        """Create spatial audio source"""
        # Create ambisonic encoder for 3D spatialization
        encoder = self.audio_context.createAmbisonicEncoder()

        # Create buffer source
        source = self.audio_context.createBufferSource()
        source.buffer = audio_buffer

        # Create ambisonic decoder
        decoder = self.audio_context.createAmbisonicDecoder()

        # Connect audio graph
        source.connect(encoder)
        encoder.connect(decoder)
        decoder.connect(self.audio_context.destination)

        spatial_source = SpatialAudioSource(source, encoder, decoder, position)
        self.sources[name] = spatial_source
        return spatial_source

    def create_reverb_zone(self, name, position, size, reverb_properties):
        """Create reverb zone for realistic acoustic simulation"""
        reverb_zone = ReverbZone(
            position, size, reverb_properties
        )
        self.reverb_zones[name] = reverb_zone
        return reverb_zone

    def update_listener(self, position, orientation, velocity=(0, 0, 0)):
        """Update listener position and orientation"""
        # Update ambisonic decoder
        self.audio_context.ambisonicDecoder.setPosition(
            position[0], position[1], position[2]
        )

        # Update orientation
        forward = orientation.forward
        up = orientation.up
        self.audio_context.ambisonicDecoder.setOrientation(
            forward[0], forward[1], forward[2],
            up[0], up[1], up[2]
        )
```

#### Month 12: Advanced Interaction and Gestures

##### Gesture Recognition

```kodeon
// Advanced gesture recognition
buat gesture_recognizer "hand_gestures":
    jenis = "hand_tracking"
    confidence_threshold = 0.8

    gestures:
        "thumbs_up" = {
            "fingers": {
                "thumb": "extended",
                "index": "folded",
                "middle": "folded",
                "ring": "folded",
                "pinky": "folded"
            },
            "palm_direction": "up"
        }

        "peace_sign" = {
            "fingers": {
                "thumb": "any",
                "index": "extended",
                "middle": "extended",
                "ring": "folded",
                "pinky": "folded"
            }
        }

        "fist" = {
            "fingers": {
                "thumb": "folded",
                "index": "folded",
                "middle": "folded",
                "ring": "folded",
                "pinky": "folded"
            }
        }

    saat gesture_terdeteksi(nama_gesture, confidence):
        jika nama_gesture == "thumbs_up" maka:
            karakter.animasi = "happy"
            audio.mainkan("sounds/positive_feedback.mp3")

        lainnya jika nama_gesture == "peace_sign" maka:
            karakter.animasi = "peace"
            efek_partikel.spawn("sparkles")

        lainnya jika nama_gesture == "fist" maka:
            karakter.animasi = "angry"
            kamera.goyang(intensity=0.5)
```

```python
# ar_vr/gestures/gesture_recognizer.py
class GestureRecognizer:
    def __init__(self):
        self.gestures = {}
        self.confidence_threshold = 0.8
        self.hand_tracker = HandTracker()

    def add_gesture(self, name, definition):
        """Add gesture definition"""
        self.gestures[name] = GestureDefinition(definition)

    def recognize_gesture(self, hand_landmarks):
        """Recognize gesture from hand landmarks"""
        best_match = None
        best_confidence = 0.0

        for gesture_name, gesture_def in self.gestures.items():
            confidence = self._match_gesture(hand_landmarks, gesture_def)

            if confidence > best_confidence:
                best_confidence = confidence
                best_match = gesture_name

        if best_confidence >= self.confidence_threshold:
            return GestureRecognitionResult(best_match, best_confidence)

        return None

    def _match_gesture(self, landmarks, gesture_def):
        """Match hand landmarks to gesture definition"""
        total_matches = 0
        total_checks = 0

        # Check finger states
        for finger_name, expected_state in gesture_def.fingers.items():
            if expected_state == "any":
                total_checks += 1
                total_matches += 1
                continue

            actual_state = self._get_finger_state(landmarks, finger_name)
            if actual_state == expected_state:
                total_matches += 1
            total_checks += 1

        # Check palm direction if specified
        if gesture_def.palm_direction:
            palm_direction = self._get_palm_direction(landmarks)
            if self._directions_match(palm_direction, gesture_def.palm_direction):
                total_matches += 1
            total_checks += 1

        return total_matches / total_checks if total_checks > 0 else 0.0
```

## API Design

### AR/VR Management API

```python
# Python API for AR/VR management
class ARVRManagerAPI:
    def __init__(self):
        self.scene_manager = SceneManager()
        self.renderer = WebGLRenderer()
        self.input_manager = InputManager()
        self.physics_engine = PhysicsEngine()

    def create_ar_scene(self, name, config):
        """Create augmented reality scene"""
        scene = self.scene_manager.create_scene(name, "ar")

        # Configure AR session
        ar_session = ARSession()
        ar_session.start_session(config.get("session", {}))

        # Set up tracking
        scene.ar_session = ar_session

        return scene

    def create_vr_scene(self, name, config):
        """Create virtual reality scene"""
        scene = self.scene_manager.create_scene(name, "vr")

        # Configure VR session
        vr_session = VRSession()
        vr_session.start_session(config.get("session", {}))

        # Set up controllers
        for controller_config in config.get("controllers", []):
            controller = self._create_controller(controller_config)
            scene.add_controller(controller)

        scene.vr_session = vr_session

        return scene

    def render_frame(self, scene):
        """Render frame for scene"""
        # Update physics
        self.physics_engine.simulate(1.0/60.0)

        # Update animations
        self.animation_system.update(1.0/60.0)

        # Render scene
        self.renderer.render_scene(scene)
```

## Integration with KODEON Core

### Compiler Integration

```rust
// compiler/src/ar_vr_integration.rs
pub struct ARVRCodeGenerator {
    pub fn generate_scene_ir(&self, scene_ast: &SceneAST) -> SceneIR {
        // Convert scene AST to intermediate representation
        SceneIR::new()
    }

    pub fn compile_ar_vr_scene(&self, scene_ir: &SceneIR) -> SceneExecutable {
        // Compile to executable scene
        SceneExecutable::new()
    }
}

pub struct ARVRRuntime {
    pub fn initialize_scene(&self, executable: &SceneExecutable) -> SceneInstance {
        // Initialize scene instance
        SceneInstance::new()
    }

    pub fn update_scene(&self, instance: &mut SceneInstance, delta_time: f32) {
        // Update scene state
    }
}
```

## Performance Considerations

### Rendering Optimization

- Level of Detail (LOD) systems for distant objects
- Occlusion culling to avoid rendering hidden objects
- Frustum culling to only render visible objects
- Instancing for repeated objects
- Texture streaming for large textures

### Physics Optimization

```python
# ar_vr/physics/optimization.py
class PhysicsOptimizer:
    def __init__(self):
        self.broadphase_optimizer = SpatialPartitioning()
        self.constraint_solver = ConstraintSolver()

    def optimize_collision_detection(self, bodies):
        """Optimize collision detection performance"""
        # Use spatial partitioning to reduce collision pairs
        self.broadphase_optimizer.update_bodies(bodies)

        # Only check bodies in same partitions
        potential_collisions = self.broadphase_optimizer.get_potential_collisions()

        return potential_collisions

    def optimize_constraint_solving(self, constraints):
        """Optimize constraint solving"""
        # Group constraints by body dependencies
        constraint_groups = self._group_constraints(constraints)

        # Solve groups in parallel where possible
        for group in constraint_groups:
            self.constraint_solver.solve_group(group)
```

## Error Handling and Debugging

### AR/VR-Specific Errors

```python
# ar_vr/errors.py
class ARVRError(Exception):
    pass

class TrackingError(ARVRError):
    pass

class RenderingError(ARVRError):
    pass

class InputError(ARVRError):
    pass

class ARVRDebugInfo:
    def __init__(self, scene):
        self.scene = scene
        self.performance_monitor = PerformanceMonitor()

    def get_diagnostics(self):
        """Get comprehensive AR/VR diagnostics"""
        return {
            "scene_info": self._get_scene_info(),
            "performance": self.performance_monitor.get_metrics(),
            "tracking_status": self._get_tracking_status(),
            "rendering_stats": self._get_rendering_stats(),
            "input_state": self._get_input_state()
        }

    def _get_scene_info(self):
        """Get scene information"""
        return {
            "entities": len(self.scene.entities),
            "active_animations": len(self.scene.get_active_animations()),
            "particle_systems": len(self.scene.get_particle_systems()),
            "audio_sources": len(self.scene.get_audio_sources())
        }
```

## Testing Strategy

### Unit Testing

```python
# ar_vr/tests/test_ecs.py
import unittest
from unittest.mock import Mock, patch

class TestEntityManager(unittest.TestCase):
    def setUp(self):
        self.entity_manager = EntityManager()

    def test_create_entity(self):
        """Test entity creation"""
        entity_id = self.entity_manager.create_entity("test_entity")

        # Verify entity exists
        self.assertIn(entity_id, self.entity_manager.entities)
        self.assertEqual(
            self.entity_manager.entities[entity_id]["name"],
            "test_entity"
        )

    def test_add_component(self):
        """Test adding component to entity"""
        entity_id = self.entity_manager.create_entity("test_entity")

        component_data = {"position": [0, 0, 0], "rotation": [0, 0, 0]}
        self.entity_manager.add_component(
            entity_id, "TransformComponent", component_data
        )

        # Verify component is added
        component = self.entity_manager.get_component(
            entity_id, "TransformComponent"
        )
        self.assertIsNotNone(component)
        self.assertEqual(component["position"], [0, 0, 0])
```

### Integration Testing

- Test 3D rendering pipeline
- Validate physics simulation accuracy
- Verify AR tracking performance
- Check VR controller input handling
- Test cross-platform compatibility

## Security Considerations

### Privacy and Data Protection

- Camera and microphone access permissions
- User location data protection
- Biometric data (hand tracking) privacy
- Secure storage of user preferences

### Content Security

- Safe loading of 3D models and textures
- Validation of user-generated content
- Protection against malicious shaders
- Secure network communication for multiplayer

## Future Extensions

### Advanced AR/VR Features

- Eye tracking integration
- Facial expression recognition
- Haptic feedback suits
- Brain-computer interface for AR/VR control

### Research Areas

- AI-powered procedural content generation
- Quantum-enhanced 3D rendering
- Neural interface for immersive experiences
- Blockchain-based virtual asset ownership
