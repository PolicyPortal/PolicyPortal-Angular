// src/app/core/models/form-control.ts (UPDATED FOR DYNAMIC LAYOUT)

export interface FormOption {
  key: string;
  value: string;
}

// No changes needed here, this interface is solid.
export interface FormFieldConfig {
  name: string;
  label: string;
  value?: any;
  controlType: 'input' | 'select' | 'radio' | 'checkbox' | 'heading' | 'paragraph' | 'calculateVehiclePremium';
  type?: 'text' | 'number' | 'date' | 'email' | 'tel' | 'h1' | 'h2' | 'h3' | 'p';
  options?: FormOption[];
  validators?: {
    required?: boolean;
    minLength?: number;
    email?: boolean;
  };
  condition?: {
    fieldName: string;
    operator: 'equals' | 'notEquals';
    value: any;
  };
  layout?: 'col-12' | 'col-md-6';
}

// No changes needed here either.
export interface SectionConfig {
  sectionTitle: string;
  controls: FormFieldConfig[];
}


// ===================================================================
// NEW INTERFACES TO SUPPORT A DYNAMIC ROW/COLUMN LAYOUT
// ===================================================================

/**
 * Represents a single column within a layout row.
 * It holds the sections and defines its width using a CSS class.
 */
export interface LayoutColumn {
  className: string; // e.g., 'col-12' for full-width, 'col-md-6' for half-width
  sections: SectionConfig[];
}

/**
 * Represents a single layout row, which can contain one or more columns.
 */
export interface LayoutRow {
  columns: LayoutColumn[];
}


// ===================================================================
// UPDATED FormConfig INTERFACE
// ===================================================================

/**
 * The main configuration for the form.
 * It now uses a flexible array of 'rows' instead of fixed left/right columns.
 */
export interface FormConfig {
  id: string; // Your original 'id' property
  rows: LayoutRow[];
}