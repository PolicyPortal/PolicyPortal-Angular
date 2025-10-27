// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
// import { FormFieldConfig, FormConfig, SectionConfig } from '../../core/models/form-control';
// import { FormConfigService } from '../../core/Services/form-config.service';

// @Component({
//   selector: 'app-form-builder',
//   standalone: true,
//   imports: [ CommonModule, FormsModule, DragDropModule ],
//   templateUrl: './form-builder.html',
//   styleUrls: ['./form-builder.scss']
// })
// export class FormBuilderComponent implements OnInit {
//   formConfig: FormConfig | undefined;
//   selectedControl: FormFieldConfig | null = null;
//   sectionToRename: SectionConfig | null = null;
//   newSectionTitle = '';

//   toolboxControls: FormFieldConfig[] = [
//     { name: 'textInput', label: 'Text Input', controlType: 'input', type: 'text', validators: { required: true } },
//     { name: 'numberInput', label: 'Number Input', controlType: 'input', type: 'number' },
//     { name: 'dateInput', label: 'Date Input', controlType: 'input', type: 'date' },
//     { name: 'dropdown', label: 'Dropdown', controlType: 'select', options: [{ key: 'opt1', value: 'Option 1' }] },
//     { name: 'radio', label: 'Radio Buttons', controlType: 'radio', options: [{ key: 'opt1', value: 'Option 1' }] },
//     { name: 'checkbox', label: 'Checkbox', controlType: 'checkbox', value: false }
//   ];

//   constructor(private formConfigService: FormConfigService) {}

//   ngOnInit(): void {
//     this.formConfigService.getFormConfig('car-insurance').subscribe(config => {
//       if (!config.leftColumnSections) { config.leftColumnSections = []; }
//       if (!config.rightColumnSections) { config.rightColumnSections = []; }
//       this.formConfig = config;
//     });
//   }

//   // --- MODIFIED drop method to handle 'left' or 'right' columns ---
//   drop(event: CdkDragDrop<FormFieldConfig[]>, sectionIndex: number, column: 'left' | 'right') {
//     if (!this.formConfig) return;

//     if (event.previousContainer === event.container) {
//       moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
//     } else {
//       const targetColumn = column === 'left' ? this.formConfig.leftColumnSections : this.formConfig.rightColumnSections;
//       if (targetColumn) {
//         const newControl: FormFieldConfig = JSON.parse(JSON.stringify(event.previousContainer.data[event.previousIndex]));
//         newControl.name = `${newControl.controlType}_${Date.now()}`;
        
//         targetColumn[sectionIndex].controls.splice(event.currentIndex, 0, newControl);
//         this.selectedControl = newControl;
//       }
//     }
//   }
  
//   // --- Section methods now specify which column to act on ---
//   addSection(column: 'left' | 'right') {
//     if (!this.formConfig) return;
//     const targetColumn = column === 'left' ? this.formConfig.leftColumnSections : this.formConfig.rightColumnSections;
//     targetColumn?.push({ sectionTitle: 'New Section', controls: [] });
//   }

//   deleteSection(sectionIndex: number, column: 'left' | 'right') {
//     if (confirm('Are you sure you want to delete this entire section?')) {
//         if (!this.formConfig) return;
//         const targetColumn = column === 'left' ? this.formConfig.leftColumnSections : this.formConfig.rightColumnSections;
//         targetColumn?.splice(sectionIndex, 1);
//     }
//   }

//   // Rename methods are generic and don't need to change
//   startRenameSection(section: SectionConfig) {
//     this.sectionToRename = section;
//     this.newSectionTitle = section.sectionTitle;
//   }

//   commitRenameSection() {
//     if (this.sectionToRename) {
//       this.sectionToRename.sectionTitle = this.newSectionTitle;
//       this.cancelRename();
//     }
//   }

//   cancelRename() {
//     this.sectionToRename = null;
//     this.newSectionTitle = '';
//   }

//   // --- Control and Option methods are unchanged ---
//   selectControl(control: FormFieldConfig) {
//     this.selectedControl = control;
//     // Ensure validators object exists when a control is selected
//     if (control && !control.validators) {
//       control.validators = {};
//     }
//   }

//   addOption() {
//     if (this.selectedControl && this.selectedControl.options) {
//       const newKey = `option_${this.selectedControl.options.length + 1}`;
//       this.selectedControl.options.push({ key: newKey, value: 'New Option' });
//     }
//   }

//   removeOption(index: number) {
//      if (this.selectedControl && this.selectedControl.options) {
//       this.selectedControl.options.splice(index, 1);
//     }
//   }

//   saveForm() {
//     if (this.formConfig) {
//       this.formConfigService.saveFormConfig(this.formConfig).subscribe(() => {
//         alert('Form configuration saved successfully!');
//       });
//     }
//   }
// }

