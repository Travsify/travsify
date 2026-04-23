import { Controller, Get, Query } from '@nestjs/common';
import axios from 'axios';

@Controller('api/v1/locations')
export class LocationController {
  @Get('search')
  async searchLocation(@Query('q') query: string) {
    if (!query || query.length < 3) return [];
    
    try {
      const response = await axios.get(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=10`);
      return response.data.features.map((f: any) => ({
        name: f.properties.name,
        city: f.properties.city || f.properties.name,
        state: f.properties.state,
        country: f.properties.country,
        full_address: [
          f.properties.name,
          f.properties.city,
          f.properties.state,
          f.properties.country
        ].filter(Boolean).join(', ')
      }));
    } catch (error) {
      return [];
    }
  }
}
