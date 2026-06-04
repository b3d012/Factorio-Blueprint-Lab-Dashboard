Factorio Blueprint Lab – Phases & Plan
Overview

This document captures all work done so far on the Factorio Blueprint Lab, including lessons learned, reordered phases for a proper development pipeline, and restrictions for a more accurate, player-configurable, and extendable blueprint generator.

We will start from scratch in a new repository and follow this plan strictly to avoid rushing or skipping essential foundational logic.

Key Lessons Learned
Recipes & ratios too early:
We initially tried to implement ratio-aware layouts before confirming that simple recipes could connect properly. This caused issues with copper-cable and gear-wheel assemblers being disconnected.
Belt logic underdeveloped:
Belts were initially treated as a single-role tile.
Factorio belts have two lanes, and items can travel differently in each lane.
Direction, corners, and lane-specific pickup/drop rules were not fully implemented.
Grid layers:
Multiple layers of grid visualization are essential:
Entity grid (assemblers, inserters, poles, belts)
Recipe grid (what each assembler is making)
Item role grid (what is flowing where)
Belt lane grid (per-lane item roles, left/right)
Configuration dashboard:
Should come first in the pipeline to allow players to set:
Grid size (e.g., 12x12, 15x15, 20x20)
Input/output port locations
Multiple input nodes per item
Allowed machines depending on research
Optional constraints (space, maximum cost, throughput targets)
Github project integrations:
Initially planned to use other GitHub calculators/projects.
Never integrated fully. We will revisit this later, after simulation is accurate.
Reordered Phase Plan for New Repo
Phase 1: Configuration Dashboard
Goal: Player sets up the space, input/output ports, allowed machines.
Outputs:
YAML/JSON config for problem setup
Grid dimensions
Input/output locations and multiple input node support
Technology profile (unlocked machines)

Restrictions:

No ratio calculations yet
No automatic layout generation yet

Phase 2: Grid & Entity Foundation
Goal: Establish grid-based layout system.
Tasks:
Entity base class (assemblers, belts, inserters, poles)
Direction enum (N, S, E, W)
Grid class with multi-layer support
Outputs:
Grid can visualize multiple layers
Supports entities with position, type, direction

Restrictions:

Single-stage recipes only for now
No belt lanes yet

Phase 3: Belt-Network Foundation (Single Lane)
Goal: Start modeling belts and simple connections.
Tasks:
BeltNode, BeltNetwork
Forward-tile logic for item movement
Inserter pickup/drop helpers (single lane)
Outputs:
Entity grid + belt network graph
Debug renderer shows adjacency and basic flows

Lessons:

Single-lane belts are insufficient for accurate Factorio simulation
Corner and directional logic must be tracked
Phase 4: Flow Graph Foundation
Goal: Build FlowGraph model for connectivity.
Tasks:
Nodes for assemblers, belts, ports
Edges for item flow, based on adjacency
Mark supported assemblers and detect orphans
Outputs:
FlowGraph visualizable via debug grids
Evaluator/validator reads FlowGraph for support calculations

Lessons:

Must later integrate belt lanes and directionality
Multi-stage recipes not handled yet
Phase 5: Ratio-Aware Demo (6.8.2 → 6.8.7)
Goal: Support multi-stage recipes with 3:2 ratio demo (electronic-circuit).
Tasks:
Create ratio-aware 3:2 layouts
Role-aware support checks (copper, iron, cable, output)
Evaluate logistics support factor
Visualize Entity, Recipe, and Item Role grids
Outputs:
15x15 (later 20x20) demo grid
Blueprint export
Debug visualizations

Lessons:

Belt lanes still simplified
One assembler occasionally disconnected
Ratios introduced too early; should have started with single-stage recipes first
Phase 6: Single-Stage Recipe Demo (Gear Wheel)
Goal: Validate system works for single-stage recipe: iron-plate → iron-gear-wheel
Tasks:
Config: iron-gear-wheel layout
Evaluator/validator support
Production math (90 gear/min per AM2)
Debug grids for entity, recipe, item roles
Outputs:
Experiment 014
Blueprint export + PNG visualizations
Tests for supported and unsupported layouts

Lessons:

System works beyond electronic-circuits
Still single-lane belts; lane logic missing
Phase 7: Belt Lane Model (6.8.10)
Goal: Implement true two-lane belts.
Tasks:
BeltLaneState per belt (left/right lane item roles)
Inserter pickup/drop lane support
FlowGraph nodes include lane metadata
Debug renderer prints belt lane tables
Outputs:
Lane-aware belts in both electronic-circuit and gear demos
Belt lane table in debug outputs

Lessons:

Foundation for accurate throughput and ratio-aware layout
Still no splitters, underground belts, or real Factorio timing
Phase 8: FlowGraph + Belt Network Integration (6.8.8)
Goal: Converge FlowGraph and BeltNetwork
Tasks:
FlowGraph edges now built from belt networks and inserter transfers
Evaluator reads FlowGraph for logistics support
Validator flags unsupported or orphan assemblers
Outputs:
Unified flow graph
Debug visualization now shows assembler connections to belts
Both demos fully supported, no orphan assemblers

Lessons:

This was rushed in the previous repo; now the foundation is solid
Multi-stage ratios can be done later on top of this
Reflections / Where We Went Wrong
Rushed pipeline:
Started multi-stage ratio layouts before single-stage recipe correctness.
Skipped proper belt lane modeling early.
Belt lanes & directionality:
Initially single-role belts
Direction, corners, and lane-specific pickup/drop not handled
Recipe support & simulation:
Only electronic-circuit multi-stage implemented early
Ratios and throughput calculations added before verifying connection correctness
Debug visualization:
Multiple layers (entity, recipe, item role, belt lanes) are essential
Some layers were incomplete or unclear
Github integrations skipped:
Other calculators/projects were considered but never integrated
Configuration dashboard missing early:
Should have come first to define grid, ports, and machine options
New Repo Roadmap
Phase 1: Configuration dashboard first
Phase 2: Grid + entity foundation
Phase 3: Belt network single lane
Phase 4: FlowGraph basic connectivity
Phase 5: Single-stage recipe demo (gear wheel)
Phase 6: Multi-stage recipe demo (electronic-circuit)
Phase 7: Two-lane belt model foundation
Phase 8: FlowGraph + BeltNetwork integration
Phase 9: Ratio-aware block generation
Phase 10: Multiple blocks, space optimization, throughput maximization

Restrictions for new build:

Do not calculate ratios or throughput until basic connectivity is verified
Belts must always have two lanes from the start
Use multiple debug layers: entity, recipe, item role, belt lanes
Keep single-stage and multi-stage recipes separate initially
Implement configuration dashboard first, allow player-defined inputs and outputs
No splitters, underground belts, modules, beacons, trains, bots, or advanced logistics yet
Each phase must be verified with blueprint export + debug visualization + pytest tests

Next Steps for New Repo:

Create new repo structure: src/, configs/, experiments/, tests/, results/
Implement Phase 1: configuration dashboard with input/output ports, grid size, multiple input nodes, allowed machines.
Incrementally rebuild phases in the correct order from above.