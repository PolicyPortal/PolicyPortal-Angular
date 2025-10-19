import { Component } from '@angular/core';
import { Header } from "./header/header";
import { Sidebar } from "./sidebar/sidebar";
import { RouterOutlet } from '@angular/router';
import { Footer } from "./footer/footer";

@Component({
  selector: 'app-portal-layout',
  imports: [Header, Sidebar, RouterOutlet],
  templateUrl: './portal-layout.html',
  styleUrl: './portal-layout.scss'
})
export class PortalLayout {

}
