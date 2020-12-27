import { TestBed } from '@angular/core/testing';

import { OnlineServiceService } from './online-service.service';

describe('OnlineServiceService', () => {
  let service: OnlineServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnlineServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
