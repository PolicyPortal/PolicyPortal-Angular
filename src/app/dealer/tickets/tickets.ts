import { Component, OnDestroy, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-tickets',
  imports: [],
  templateUrl: './tickets.html',
  styleUrl: './tickets.scss'
})
export class Tickets implements OnInit, OnDestroy {
  // Properties to hold the ticket counts
  claimCount: number = 25;
  financeCount: number = 12;
  endorsementCount: number = 8;
  cancellationCount: number = 5;

  // Property to hold the chart instance
  private chart: Chart | undefined;

  constructor() { }

  ngOnInit(): void {
    // Call the method to create the chart when the component initializes
    this.createChart();
  }

  ngOnDestroy(): void {
    // Destroy the chart instance to prevent memory leaks when the component is destroyed
    if (this.chart) {
      this.chart.destroy();
    }
  }

  createChart(): void {
    // Sample data for the chart, using the component's properties
    const data = {
      labels: ['Claim Tickets', 'Finance Tickets', 'Endorsement Tickets', 'Cancellation Tickets'],
      datasets: [{
        label: 'Number of Tickets',
        data: [
          this.claimCount,
          this.financeCount,
          this.endorsementCount,
          this.cancellationCount
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.5)',
          'rgba(22, 163, 74, 0.5)',
          'rgba(234, 179, 8, 0.5)',
          'rgba(239, 68, 68, 0.5)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(22, 163, 74)',
          'rgb(234, 179, 8)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 1
      }]
    };

    // Render the chart on the canvas element in the template
    const canvasElement = document.getElementById('ticketChart') as HTMLCanvasElement;
    if (canvasElement) {
      this.chart = new Chart(canvasElement, {
        type: 'bar',
        data: {
            labels: ['Claim', 'Finance', 'Endorsement', 'Cancellation'],
            datasets: [{
                label: 'Ticket Count',
                data: [this.claimCount, this.financeCount, this.endorsementCount, this.cancellationCount],
                backgroundColor: [
                    '#0d6dfdd8',
                    '#198754d7',
                    '#ffc107e0',
                    '#dc3546d8'
                ],
                borderRadius: 5,
                barThickness: 50
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    }
                },
                x: {
                     grid: {
                        display: false
                    }
                }
            }
        }
      });
    }
  }
}