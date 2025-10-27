// src/app/features/two-wheeler-formbuilder/two-wheeler-formbuilder.ts (FINAL with PREDICATE FIX)

import { CdkDrag, CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormConfig, FormFieldConfig, LayoutColumn, LayoutRow, SectionConfig } from '../../core/models/form-control'; 
import { FormConfigService } from '../../core/Services/form-config.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-two-wheeler-formbuilder',
  imports: [CommonModule, FormsModule, DragDropModule ],
  templateUrl: './two-wheeler-formbuilder.html',
  styleUrls: ['./two-wheeler-formbuilder.scss']
})
export class TwoWheelerFormbuilder implements OnInit {

  @ViewChild('toolboxList') toolboxList!: CdkDropList;
    
  formConfig: FormConfig | undefined;
  selectedControl: FormFieldConfig | null = null;
  sectionToRename: SectionConfig | null = null;
  newSectionTitle = '';
  isFormReady = false;
  isSectionDragging = false; 
  isRowDragging = false;
  isToolboxDragging = false;

  toolboxControls: FormFieldConfig[] = [
    { name: 'textInput', label: 'Text Input', controlType: 'input', type: 'text', validators: { required: true } },
    { name: 'numberInput', label: 'Number Input', controlType: 'input', type: 'number' },
    { name: 'dateInput', label: 'Date Input', controlType: 'input', type: 'date' },
    { name: 'dropdown', label: 'Dropdown', controlType: 'select', options: [{ key: 'opt1', value: 'Option 1' }] },
    { name: 'radio', label: 'Radio Buttons', controlType: 'radio', options: [{ key: 'opt1', value: 'Option 1' }] },
    { name: 'checkbox', label: 'Checkbox', controlType: 'checkbox', value: false }
  ];
  CustomToolboxControls: FormFieldConfig[] = [
    { name: 'heading', label: 'Heading-h2', controlType: 'heading', type: 'h2' ,layout: 'col-12'},
    { name: 'paragraph', label: 'Paragraph', controlType: 'paragraph', type: 'p' , layout: 'col-12' }, 
    { name: 'calculateVehiclePremium', label: 'Calculate Vehicle Premium', controlType: 'calculateVehiclePremium' , layout: 'col-12' }
  ];
  allToolboxControls: FormFieldConfig[] = [...this.toolboxControls, ...this.CustomToolboxControls];

  constructor(private formConfigService: FormConfigService, private http: HttpClient) {}

  ngOnInit(): void {
    this.formConfigService.getFormConfig('two-wheeler-insurance').subscribe(config => {
      if ((config as any).leftColumnSections || (config as any).rightColumnSections) {
        this.formConfig = this.migrateOldConfigToNew(config);
      } else {
        if (!config.rows) { config.rows = []; }
        this.formConfig = config;
      }
      this.isFormReady = true;
    });
  }
  
  // --- NEW PREDICATE FUNCTIONS ---
  
  /**
   * This function runs every time a dragged item hovers over the main row list.
   * It returns FALSE if the item is from the toolbox, effectively blocking it.
   */
  rowDropPredicate = (item: CdkDrag<any>): boolean => {
    return !this.isToolboxDragging;
  };

  /**
   * This function runs when an item hovers over a section drop zone.
   * It blocks items from the toolbox.
   */
  sectionDropPredicate = (item: CdkDrag<any>): boolean => {
    return !this.isToolboxDragging;
  };

  // --- GETTERS FOR DRAG & DROP CONNECTIONS ---

  get getSectionDropListIds(): string[] {
    if (!this.formConfig) { return []; }
    const ids: string[] = [];
    this.formConfig.rows.forEach((row, rowIndex) => {
      row.columns.forEach((col, colIndex) => {
        ids.push(`col-${rowIndex}-${colIndex}`);
      });
    });
    return ids;
  }

  get getControlDropListIds(): string[] {
    if (!this.formConfig) { return []; }
    const ids: string[] = [];
    this.formConfig.rows.forEach((row, rowIndex) => {
      row.columns.forEach((col, colIndex) => {
        col.sections.forEach((section, sectionIndex) => {
          ids.push(`control-list-${rowIndex}-${colIndex}-${sectionIndex}`);
        });
      });
    });
    return ids;
  }

  get getConnectedControlDropLists(): (CdkDropList | string)[] {
    if (!this.toolboxList) { return []; }
    return [this.toolboxList, ...this.getControlDropListIds];
  }

  // --- DRAG & DROP EVENT HANDLERS ---

  onRowDrop(event: CdkDragDrop<LayoutRow[]>) {
    if (this.formConfig) {
      moveItemInArray(this.formConfig.rows, event.previousIndex, event.currentIndex);
    }
  }

  onSectionDrop(event: CdkDragDrop<SectionConfig[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  drop(event: CdkDragDrop<FormFieldConfig[]>, rowIndex: number, colIndex: number, sectionIndex: number) {
    if (!this.formConfig) return;
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const targetSection = this.formConfig.rows[rowIndex].columns[colIndex].sections[sectionIndex];
      const newControl: FormFieldConfig = JSON.parse(JSON.stringify(event.previousContainer.data[event.previousIndex]));
      newControl.name = `${newControl.controlType}_${Date.now()}`;
      if (!newControl.layout) {
        newControl.layout = 'col-md-6';
      }
      targetSection.controls.splice(event.currentIndex, 0, newControl);
      this.selectControl(newControl);
    }
  }

  onDropToTrash(event: CdkDragDrop<FormFieldConfig[]>) {
    if (event.previousContainer.id !== 'toolbox-list') {
      if (this.selectedControl === event.item.data) { this.selectedControl = null; }
      event.previousContainer.data.splice(event.previousIndex, 1);
    }
  }
  
  // --- FORM CONFIGURATION & SAVE ---

  saveForm() {
    if (!this.formConfig) { return; }
    const configToSave = JSON.parse(JSON.stringify(this.formConfig));
    configToSave.rows.forEach((row: LayoutRow) => {
      row.columns.forEach((column: LayoutColumn) => {
        for (let i = column.sections.length - 1; i >= 0; i--) {
          if (column.sections[i].controls.length === 0) { column.sections.splice(i, 1); }
        }
      });
      for (let i = row.columns.length - 1; i >= 0; i--) {
        if (row.columns[i].sections.length === 0) { row.columns.splice(i, 1); }
      }
    });
    for (let i = configToSave.rows.length - 1; i >= 0; i--) {
      if (configToSave.rows[i].columns.length === 0) { configToSave.rows.splice(i, 1); }
    }
    this.formConfigService.saveFormConfig(configToSave).subscribe(() => {
      alert('Form configuration saved successfully!');
    });
  }

  migrateOldConfigToNew(oldConfig: any): FormConfig {
    const newConfig: FormConfig = { id: oldConfig.id, rows: [] };
    if (oldConfig.leftColumnSections?.length > 0 || oldConfig.rightColumnSections?.length > 0) {
      newConfig.rows.push({ columns: [{ className: 'col-md-6', sections: oldConfig.leftColumnSections || [] }, { className: 'col-md-6', sections: oldConfig.rightColumnSections || [] }] });
    }
    return newConfig;
  }

  // --- LAYOUT & SECTION MANAGEMENT ---

  addLayoutRow(type: 'full' | 'split') {
    if (!this.formConfig) return;
    let newRow: LayoutRow;
    if (type === 'full') {
      newRow = { columns: [{ className: 'col-12', sections: [{ sectionTitle: 'Full-Width Section', controls: [] }] }] };
    } else {
      newRow = { columns: [{ className: 'col-md-6', sections: [{ sectionTitle: 'Left Section', controls: [] }] }, { className: 'col-md-6', sections: [{ sectionTitle: 'Right Section', controls: [] }] }] };
    }
    this.formConfig.rows.push(newRow);
  }

  deleteRow(rowIndex: number) {
    if (confirm('Are you sure you want to delete this entire row?')) {
      if (!this.formConfig) return;
      this.formConfig.rows.splice(rowIndex, 1);
    }
  }

  addSection(rowIndex: number, colIndex: number) {
    if (!this.formConfig) return;
    this.formConfig.rows[rowIndex].columns[colIndex].sections.push({ sectionTitle: 'New Section', controls: [] });
  }

  deleteSection(rowIndex: number, colIndex: number, sectionIndex: number) {
    if (confirm('Are you sure you want to delete this section?')) {
      if (!this.formConfig) return;
      this.formConfig.rows[rowIndex].columns[colIndex].sections.splice(sectionIndex, 1);
    }
  }

  copySection(rowIndex: number, colIndex: number, sectionIndex: number) {
    if (!this.formConfig) return;
    const sourceSection = this.formConfig.rows[rowIndex].columns[colIndex].sections[sectionIndex];
    const newSection = JSON.parse(JSON.stringify(sourceSection));
    newSection.sectionTitle = `${sourceSection.sectionTitle} (Copy)`;
    newSection.controls.forEach((control: FormFieldConfig) => {
      control.name = `${control.controlType}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    });
    this.formConfig.rows[rowIndex].columns[colIndex].sections.splice(sectionIndex + 1, 0, newSection);
  }
  
  startRenameSection(section: SectionConfig) {
    this.sectionToRename = section;
    this.newSectionTitle = section.sectionTitle;
  }

  commitRenameSection() {
    if (this.sectionToRename) {
      this.sectionToRename.sectionTitle = this.newSectionTitle;
      this.cancelRename();
    }
  }

  cancelRename() {
    this.sectionToRename = null;
    this.newSectionTitle = '';
  }

  // --- CONTROL PROPERTIES MANAGEMENT ---

  selectControl(control: FormFieldConfig) {
    this.selectedControl = control;
    if (control && !control.validators) { control.validators = {}; }
  }

  copySelectedControl() {
    if (!this.selectedControl || !this.formConfig) return;
    for (const row of this.formConfig.rows) {
        for (const column of row.columns) {
            for (const section of column.sections) {
                const controlIndex = section.controls.findIndex(c => c.name === this.selectedControl!.name);
                if (controlIndex !== -1) {
                    const newControl = JSON.parse(JSON.stringify(this.selectedControl));
                    newControl.name = `${newControl.controlType}_${Date.now()}`;
                    newControl.label = `${newControl.label} (Copy)`;
                    section.controls.splice(controlIndex + 1, 0, newControl);
                    this.selectControl(newControl);
                    return;
                }
            }
        }
    }
  }

  deleteSelectedControl() {
    if (!this.selectedControl || !this.formConfig) return;
    if (confirm(`Are you sure you want to delete the control "${this.selectedControl.label}"?`)) {
        for (const row of this.formConfig.rows) {
            for (const column of row.columns) {
                for (const section of column.sections) {
                    const controlIndex = section.controls.findIndex(c => c.name === this.selectedControl!.name);
                    if (controlIndex !== -1) {
                        section.controls.splice(controlIndex, 1);
                        this.selectedControl = null;
                        return;
                    }
                }
            }
        }
    }
  }
  
  getAvailableTriggerFields(): FormFieldConfig[] {
    if (!this.formConfig || !this.selectedControl) { return []; }
    const allFields = this.formConfig.rows.flatMap(r => r.columns.flatMap(c => c.sections.flatMap(s => s.controls)));
    return allFields.filter(f => f.name !== this.selectedControl?.name);
  }

  getAvailableTriggerFieldsValues(fieldName: string): any[] {
    if (!this.formConfig || !fieldName) { return []; }
    const allFields = this.formConfig.rows.flatMap(r => r.columns.flatMap(c => c.sections.flatMap(s => s.controls)));
    const targetField = allFields.find(f => f.name === fieldName);
    return targetField?.options?.map(o => o.value) || [];
  }

  addOption() {
    if (this.selectedControl && this.selectedControl.options) {
      this.selectedControl.options.push({ key: `option_${this.selectedControl.options.length + 1}`, value: 'New Option' });
    }
  }

  removeOption(index: number) {
    if (this.selectedControl && this.selectedControl.options) {
      this.selectedControl.options.splice(index, 1);
    }
  }

  toggleCondition(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (!this.selectedControl) return;
    if (checkbox.checked) {
      this.selectedControl.condition = { fieldName: '', operator: 'equals', value: '' };
    } else {
      delete this.selectedControl.condition;
    }
  }
}

