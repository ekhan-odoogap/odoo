<template>
  <ValidationObserver v-slot="{ handleSubmit, reset }">
    <form class="form" @submit.prevent="handleSubmit(submitForm(reset))">
      <div class="form__horizontal">
        <ValidationProvider
          v-slot="{ errors }"
          rules="required|min:2"
          class="form__element"
        >
          <SfInput
            v-model="form.name"
            name="name"
            label="Name"
            required
            :valid="!errors[0]"
            :error-message="errors[0]"
          />
        </ValidationProvider>
      </div>
      <ValidationProvider
        v-slot="{ errors }"
        rules="required|email"
        class="form__element"
      >
        <SfInput
          v-model="form.email"
          type="email"
          name="email"
          label="Your e-mail"
          required
          :valid="!errors[0]"
          :error-message="errors[0]"
        />
      </ValidationProvider>
      <SfModal
        :visible="requirePassword"
        :title="$t('Attention!')"
        cross
        persistent
        @close="requirePassword = false"
      >
        {{
          $t('Please type your current password to change your email address.')
        }}
        <SfInput
          v-model="currentPassword"
          type="password"
          name="currentPassword"
          label="Current Password"
          required
          class="form__element"
          style="margin-top: 10px"
          @keypress.enter="handleSubmit(submitForm(reset))"
        />
        <SfButton class="form__button" type="submit">
          {{ $t('Update personal data') }}
        </SfButton>
      </SfModal>
      <SfButton class="form__button">
        {{ $t('Update personal data') }}
      </SfButton>
    </form>
  </ValidationObserver>
</template>

<script>
import { ref } from '@nuxtjs/composition-api';
import { useUiNotification } from '~/composables';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { useUser, userGetters } from '@vue-storefront/odoo';
import { SfInput, SfButton, SfModal } from '@storefront-ui/vue';
export default {
  name: 'ProfileUpdateForm',
  components: {
    SfInput,
    SfButton,
    SfModal,
    ValidationProvider,
    ValidationObserver
  },
  props: {
    loading: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ['submit'],
  setup(props, { emit }) {
    const { send } = useUiNotification();
    const { user } = useUser();

    const currentPassword = ref('');
    const requirePassword = ref(false);

    const resetForm = () => ({
      name: userGetters.getFirstName(user.value),
      email: userGetters.getEmailAddress(user.value)
    });
    const form = ref(resetForm());

    const submitForm = (resetValidationFn) => () => {
      const onComplete = () => {
        form.value = resetForm();
        requirePassword.value = false;
        currentPassword.value = '';
        resetValidationFn();

        send({ message: 'Update Succefully.', type: 'success' });
      };
      const onError = (error) => {
        form.value = resetForm();
        requirePassword.value = false;
        currentPassword.value = '';
        send({ message: error?.value, type: 'danger' });
      };

      emit('submit', { form, onComplete, onError });
    };

    return {
      submitForm,
      user,
      requirePassword,
      currentPassword,
      form
    };
  }
};
</script>
<style lang="scss" scoped>
.form {
  &__element {
    display: block;
    margin: 0 0 var(--spacer-lg) 0;
  }
  &__button {
    display: block;
    width: 100%;
    @include for-desktop {
      width: 17.5rem;
    }
  }
  &__horizontal {
    @include for-desktop {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .form__element {
      @include for-desktop {
        flex: 1;
        margin-right: var(--spacer-2xl);
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
