import { Model } from 'mongoose';

export class DbRepo {
  constructor(private readonly model: Model<any>) { }
  async create(data: any): Promise<any> {
    return await this.model.create(data);
  }
  async findOne(query: any, options?: any): Promise<any> {
    return await this.model.findOne(query, options);
  }
  async findOneAndPopulate(query: any, populate?: any): Promise<any> {
    return await this.model.findOne(query).populate(populate);
  }
  async findAll(query: any, options?: any): Promise<any> {
    return await this.model.find(query, options);
  }
  async find(query: any, options?: any): Promise<any> {
    return await this.model.find(query, options);
  }
  async findById(query: any, options?: any): Promise<any> {
    return await this.model.findById(query, options);
  }
  async update(query: any, data: any): Promise<any> {
    return await this.model.updateOne(query, data);
  }
  async delete(query: any): Promise<any> {
    return await this.model.deleteOne(query);
  }
  async updateOne(query: any, data: any): Promise<any> {
    return await this.model.updateOne(query, data);
  }
  async findOneAndUpdate(query: any, data: any, options?: any): Promise<any> {
    return await this.model.findOneAndUpdate(query, data, options);
  }
  async findOneAndDelete(query: any, options?: any): Promise<any> {
    return await this.model.findOneAndDelete(query, options);
  }
  async paginate(query: any, options?: any): Promise<any> {
    const result = await this.model.aggregate([
      {
        $facet: {
          data: [
            {
              $skip: (options.page - 1) * options.limit,
            },
            {
              $limit: options.limit,
            },
          ],
          count: [
            {
              $count: "total",
            },
          ],
        },
      },
    ]);
    return {
      data: result[0].data,
      count: result[0].count[0].total,
    };
  }
}
