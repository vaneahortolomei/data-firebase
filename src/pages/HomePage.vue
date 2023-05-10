<template>
    <div class="todo">
        <div class="todo__header">
            <Input
                id="todo"
                v-model="v$.todo.$model"
                label="Todo"
                type="text"
                name="todo"
                @blur="v$.todo.$touch"
            />
            <span
                v-for="(error, index) in v$.todo.$errors"
                :key="index"
                class="form__error"
            >
        {{ error.$message }}
            </span>
        </div>
        <div v-if="todos.size" class="todo__body">
            <ul class="list">
                <li class="list__item"
                    v-for="(todo, index) in todos"
                    :data-id="index"
                    :key="index">
                    <div>
                        {{index}}
                        {{todo}}
                    </div>
                    <button @click="deleteItem(todo)" class="button">Delete</button>
                </li>
            </ul>
        </div>
        <div class="todo__footer">
            <button @click="addTodo" type="button" class="button">Add</button>
        </div>
    </div>
</template>

<script setup>
    import Input from "../components/form/InputComponent.vue";
    import {computed, reactive} from "vue";
    import {email, minLength, required} from "@vuelidate/validators";
    import {useVuelidate} from "@vuelidate/core";
    import {inject} from "vue";

    let key = inject("key");


    const todos = reactive(new Set());


    console.log(todos);

    const state = reactive({
        todo: ""
    });

    const rules = computed(() => ({
        todo: {
            required,
            minLength: minLength(2),
            $lazy: true,
        },
    }));

    const v$ = useVuelidate(rules, state);


    const timeout = (time) => {
        return setTimeout(() => {
            key.message = "";
        }, time);
    };

    const addTodo = () => {
        v$.value.$validate()
            .then((valid) => {
                if (valid) {
                    todos.add(state.todo);
                    key.message = `Todo was added!`;

                    state.todo = "";

                    timeout(2000);
                }
                if(!valid){
                    key.message = `input is empty! Add something.`;
                    timeout(2000);
                }
            }).catch(e => {
            console.log(e);
        })
    };

    const deleteItem = (todo) => {
        todos.delete(todo);
        key.message = `todo was removed!`;

        timeout(2000);
    }


</script>
<style scoped lang="scss">
    .todo {
        &__footer {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .list {
        list-style-type: none;
        padding: 0;
        margin: 0;

        &__item {
            background: var(--main-color);
            color: var(--white-color);
            padding: 20px;
            border-radius: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            + .list__item {
                margin-top: 15px;
            }

            .button {
                background: var(--white-color);
                color: var(--main-color);
            }
        }
    }

    div {
        padding: 20px;
    }
</style>
