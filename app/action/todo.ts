'use server';
import db from '@/db';
// import { Prisma } from '@prisma/client';

export async function getTodos() {
    try {
        const todos = await db.todo.findMany();
        return {
            data: todos
        };

    } catch (err) {
        console.error(err);
        return {
            error: err
        };
    }
}

export async function addTodo({ message, title, done }: {
    title: string;
    message: string;
    done: boolean;
}) {
    try {
        const todo = await db.todo.create({
            data: {
                message,
                title,
                done
            }
        });
        if (todo) {
            return {
                data: todo
            }
        } else {
            return {
                error: "Error creating todo"
            }
        }
    } catch (err) {
        console.error(err);
        return {
            error: err
        };
    }

}

export async function updateTodo(id: string, { message, title, done }: {
    message: string;
    title: string;
    done: boolean;
}) {
    try {
        const todo = await db.todo.update({
            where: {
                id
            },
            data: {
                message,
                title,
                done
            }
        });
        if (todo) {
            return {
                data: todo
            }
        } else {
            return {
                error: "Error updating todo"
            }
        }
    } catch (err) {
        console.error(err);
        return {
            error: err
        };
    }
}

export async function deleteTodo(id: string) {
    try {
        const todo = await db.todo.delete({
            where: {
                id
            }
        });
        if (todo) {
            return {
                data: todo
            }
        } else {
            return {
                error: "Error deleting todo"
            }
        }
    } catch (err) {
        console.error(err);
        return {
            error: err
        };
    }
}