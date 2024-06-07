import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { SimpleDialogComponent } from "src/app/_shared/components/simple-dialog/simple-dialog.component";
import { Reference } from "src/app/_shared/models/reference.model";
import { ReferenceService } from "src/app/_shared/services/reference.service";
import { CountryService } from "src/app/_shared/services/country.service";
import { StateService } from "src/app/_shared/services/state.service";

@Component({
  selector: 'reference-tabs',
  templateUrl: './reference-tabs.component.html'
})

export class ReferenceTabsComponent implements OnInit {
  reference: Reference = { idFolio: 0 };
  id: any;
  countries: any[] = [];
  states: any[] = [];
  isEdit = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private referenceService: ReferenceService,
    private dialog: MatDialog,
    private countryService: CountryService,
    private stateService: StateService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    this.countryService.getAll()
      .pipe()
      .subscribe({
        next: (response) => {
          this.countries = response;
        },
        error: () => {
          console.error('Error trying to get countries');
        }
      });
    this.stateService.getAll()
      .pipe()
      .subscribe({
        next: (response) => {
          this.states = response;
        },
        error: () => {
          console.error('Error trying to get states');
        }
      });

    if (this.id) {
      this.isEdit = true;
      this.referenceService.getById(this.id)
        .pipe()
        .subscribe({
          next: (response) => {
            this.reference = response;
          },
          error: () => {
            this.dialog.open(SimpleDialogComponent, {
              data: { type: 'error', message: `Error al obtener los datos del referencee ${this.id}` },
            })
              .afterClosed()
              .subscribe(() => {
                this.router.navigate([`/secure/references`]);
              });
            console.error('Error trying to get reference detail');
          }
        });
    }
  }
}