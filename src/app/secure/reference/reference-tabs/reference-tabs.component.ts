import { Component, OnInit } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { Client } from "src/app/_shared/models/client.model";
import { ClientService } from "src/app/_shared/services/client.service";

@Component({
  selector: 'reference-tabs',
  templateUrl: './reference-tabs.component.html'
})

export class ReferenceTabsComponent implements OnInit {
  clients: Client[] = []
  constructor(private clientService: ClientService
  ) { }

  async ngOnInit() {
    try {
      this.clients = await lastValueFrom(this.clientService.getAllActive());
    } catch (error) {
      console.error('Error trying to get clients');
    }
  }
}