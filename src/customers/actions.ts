import { type Customer } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import {
  DeleteCustomer,
  UpdateCustomer,
  type CreateCustomer,
} from 'wasp/server/operations';

type CreateArgs = Omit<Customer, 'id'>;

export const createCustomer: CreateCustomer<CreateArgs, Customer> = async (
  {
    name,
    surname,
    email,
    dateOfBirth,
    premiumUser,
    username,
    address,
    postalCode,
    country,
  },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Customer.create({
    data: {
      name,
      surname,
      email,
      dateOfBirth,
      premiumUser,
      username,
      address,
      postalCode,
      country,
    },
  });
};

export const updateCustomer: UpdateCustomer<Customer> = async (
  {
    id,
    name,
    surname,
    email,
    dateOfBirth,
    premiumUser,
    username,
    address,
    postalCode,
    country,
  },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Customer.update({
    where: {
      id,
    },
    data: {
      name,
      surname,
      email,
      dateOfBirth,
      premiumUser,
      username,
      address,
      postalCode,
      country,
    },
  });
};

export const deleteCustomer: DeleteCustomer<Customer['id']> = async (
  id,
  context
) => {
  return context.entities.Customer.deleteMany({
    where: {
      id: id,
    },
  });
};
