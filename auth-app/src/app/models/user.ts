export class User {
  name: string;
  title: string;
  email: string;
  username: string;
  photo: string;

  constructor(
    name: string,
    title: string,
    email: string,
    username: string,
    photo: string
  ) {
    this.name = name;
    this.title = title;
    this.email = email;
    this.username = username;
    this.photo = photo;
  }
}
