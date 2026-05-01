import { Query } from "mongoose";

interface IQueryString {
  page?: string;
  limit?: string;
  filter?: string;
  fields?: string;
  sort?: string;
}

interface IAPIFeatures<T> {
  query: Query<T[], T>;
  queryString: IQueryString;
  pageInfo?: { page: number; limit: number; skip: number };
  filtering: () => this;
  sort: () => this;
  project: () => this;
  paginate: () => this;
}

export class APIFeatures<T> implements IAPIFeatures<T> {
  query: Query<T[], T>;
  queryString: IQueryString;
  pageInfo?: { page: number; limit: number; skip: number };

  constructor(query: Query<T[], T>, queryString: IQueryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filtering() {
    const filter = this.queryString.filter || "";
    this.query = this.query.find({
      $or: [
        { firstName: { $regex: `^${filter}`, $options: "i" } },
        { lastName: { $regex: `^${filter}`, $options: "i" } },
      ],
    });

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  project() {
    if (this.queryString.fields) {
      const fieldStr = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fieldStr);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 5;
    const skip = (page - 1) * limit;

    this.query = this.query.limit(limit).skip(skip);
    this.pageInfo = { page, limit, skip };
    return this;
  }
}
