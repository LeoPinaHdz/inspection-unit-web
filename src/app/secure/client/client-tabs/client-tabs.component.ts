import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { lastValueFrom } from "rxjs";
import { SimpleDialogComponent } from "src/app/_shared/components/simple-dialog/simple-dialog.component";
import { Client } from "src/app/_shared/models/client.model";
import { ClientService } from "src/app/_shared/services/client.service";
import { CountryService } from "src/app/_shared/services/country.service";
import { StateService } from "src/app/_shared/services/state.service";

@Component({
  selector: 'client-tabs',
  templateUrl: './client-tabs.component.html'
})

export class ClientTabsComponent implements OnInit {
  client: Client = { idCliente: 0 };
  id: any;
  countries: any[] = [];
  states: any[] = [];
  isEdit = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clientService: ClientService,
    private dialog: MatDialog,
    private countryService: CountryService,
    private stateService: StateService
  ) { }

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    try {
      this.countries = await lastValueFrom(this.countryService.getAll());
    } catch (error) {
      console.error('Error trying to get countries');
    }

    try {
      this.states = await lastValueFrom(this.stateService.getAll());
    } catch (error) {
      console.error('Error trying to get states');
    }

    if (this.id) {
      this.isEdit = true;
      try {
        this.client = await lastValueFrom(this.clientService.getById(this.id));
      } catch (error) {
        this.dialog.open(SimpleDialogComponent, {
          data: { type: 'error', message: `Error al obtener los datos del cliente ${this.id}` },
        })
          .afterClosed()
          .subscribe(() => {
            this.router.navigate([`/secure/clients`]);
          });
        console.error('Error trying to get client detail');
      }
    }
  }
}