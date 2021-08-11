import { TestBed } from '@angular/core/testing';

import { BackburnerService } from './backburner.service';

describe('BackburnerService', () => {
  let service: BackburnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackburnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
