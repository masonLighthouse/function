import { TestBed } from '@angular/core/testing';

import { MitService } from './mit.service';

describe('MitService', () => {
  let service: MitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
