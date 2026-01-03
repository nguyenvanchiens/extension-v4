# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HNC Code Generator is a React web application that generates C# boilerplate code for the PortalApi module. Users input entity configuration (name, properties, endpoints) and the app generates Entity, Repository, Service, Endpoints, Models, and Mapping files following the Fastlink.Portal namespace conventions.

## Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Type-check with tsc and build for production
- `npm run lint` - Run ESLint on the project
- `npm run preview` - Preview production build locally

## Architecture

### Code Generation Pipeline (`src/generators/`)

The core functionality follows a generator pipeline pattern where `generateAll()` orchestrates six specialized generators:

1. **entityGenerator** - Creates C# entity classes extending `BaseEntity` with optional `ICanUpdated` and `ICanDeleted` interfaces
2. **repositoryGenerator** - Generates repository classes
3. **serviceGenerator** - Generates service layer classes
4. **modelGenerator** - Creates request/response DTOs
5. **endpointGenerator** - Generates API endpoint classes based on selected types (Create, Update, Delete, GetById, GetList, GetAll)
6. **mappingGenerator** - Creates AutoMapper profile hints

Each generator receives `EntityConfig` and returns `GeneratedFile` objects containing the file path, name, content, and category.

### Type System (`src/types/index.ts`)

- `EntityConfig` - Main configuration object with module name, entity name, properties, and feature flags (`hasCanUpdated`, `hasSoftDelete`, `hasActivityLog`)
- `PropertyDefinition` - Property metadata including C# type, validation constraints
- `CSharpType` - Supported C# types including nullable variants
- `EndpointType` - Six endpoint types that can be selectively generated

### UI Components (`src/components/`)

- `PropertyEditor` - Form for adding/editing entity properties
- `FileTree` - Navigation tree for generated files organized by category
- `CodePreview` - Syntax-highlighted code display using prism-react-renderer

### Output Utilities (`src/utils/zipGenerator.ts`)

- `downloadAsZip()` - Packages generated files with folder structure using JSZip
- `copyAllToClipboard()` - Concatenates all files with headers for clipboard

## Generated Code Conventions

All generated C# code follows these patterns:
- Namespace: `Fastlink.{ModuleName}.Business.Infrastructure.*`
- Entity base class: `BaseEntity` with optional interfaces (`ICanUpdated`, `ICanDeleted`)
- Entities include `[Table("EntityName")]` attribute
- Files are categorized as: Entity, Repository, Service, Endpoint, Model, Mapping

## Tech Stack

- React 19 with TypeScript
- Vite 7 for build tooling
- Tailwind CSS 4 for styling
- lucide-react for icons
- prism-react-renderer for code highlighting
- JSZip + file-saver for ZIP export
