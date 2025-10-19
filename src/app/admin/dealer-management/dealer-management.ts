import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { delay, Observable, of } from 'rxjs';
import { Dealer, DealerService } from '../../core/Services/dealer.service';



@Component({
  selector: 'app-dealer-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './dealer-management.html',
  styleUrl: './dealer-management.scss'
})
export class DealerManagement {

  dealers: Dealer[] = [];
  selectedDealer: Dealer | null = null;
  isEditing = false;

  constructor(private dealerService: DealerService) {}

  ngOnInit(): void {
    this.loadDealers();
  }

  loadDealers(): void {
    this.dealerService.getDealers().subscribe(data => {
      console.log('Dealers loaded:', data);
      this.dealers = data;
    });
  }

  onAddNewDealer(): void {
    this.isEditing = false;
    this.selectedDealer = {
      dealer_id: 0, // A temporary ID for a new dealer
      Name: '',
      Role: '',
      Email: '',
      Password: '',
      Phone: '',
      Location: '',
      Status: 'Active'
    };
  }

  onEdit(dealer: Dealer): void {
    this.isEditing = true;
    // Create a copy to avoid modifying the list directly
    this.selectedDealer = { ...dealer };
  }

  onSave(): void {
    if (!this.selectedDealer) return;

    if (this.isEditing) {
      // Update existing dealer
      // this.dealerService.updateDealer(this.selectedDealer).subscribe(() => {
      //   this.resetForm();
      //   this.loadDealers();
      // });
    } else {
      // Add new dealer (we omit the temporary id)
      const { dealer_id, ...newDealerData } = this.selectedDealer;
      this.dealerService.addDealer(newDealerData).subscribe(() => {
        console.log('New dealer added:', newDealerData);
      });
    }
    
    
    this.resetForm();
    this.selectedDealer = null;

    //wait for 1sec
    setTimeout(() => {
      this.loadDealers();
    }, 100);

  }

  onDelete(id: number): void {
    // if (confirm('Are you sure you want to delete this dealer?')) {
    //   this.dealerService.deleteDealer(id).subscribe(() => {
    //     this.loadDealers();
    //   });
    // }
  }


  
  private resetForm(): void {
    this.selectedDealer = null;
    this.isEditing = false;
  }


  closeModal(): void {
    this.selectedDealer = null;
  }
}
