import { Component, OnInit } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { Client } from "src/app/_shared/models/client.model";
import { CountrySE } from "src/app/_shared/models/country.model";
import { Standard } from "src/app/_shared/models/standard.model";
import { ClientService } from "src/app/_shared/services/client.service";
import { CountryService } from "src/app/_shared/services/country.service";
import { StandardService } from "src/app/_shared/services/standard.service";

@Component({
  selector: 'reference-tabs',
  templateUrl: './reference-tabs.component.html'
})

export class ReferenceTabsComponent implements OnInit {
  clients: Client[] = [];
  countries: CountrySE[] = [];
  standards: Standard[] = [];
  constructor(private clientService: ClientService,
    private countryService: CountryService,
    private standardService: StandardService
  ) { }

  async ngOnInit() {
    try {
      this.clients = await lastValueFrom(this.clientService.getAllActive());
    } catch (error) {
      console.error('Error trying to get clients');
    }

    try {
      this.countries = await lastValueFrom(this.countryService.getAllSE());
    } catch (error) {
      console.error('Error trying to get countries');
    }
    try {
      this.standards = await lastValueFrom(this.standardService.getAll());
    } catch (error) {
      console.error('Error trying to get standard list');
    }
  }
}