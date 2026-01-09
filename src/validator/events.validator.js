const Joi = require('joi');

module.exports = {
  event: (data) =>
    Joi.object({
      isEdit: Joi.boolean().optional(),

      title: Joi.string()
        .max(255)
        .when('isEdit', {
          is: true,
          then: Joi.optional(),
          otherwise: Joi.required()
        }),

      description: Joi.string().allow('', null).optional(),
      location: Joi.string().allow('', null).optional(),

      event_date: Joi.date().when('isEdit', {
        is: true,
        then: Joi.optional(),
        otherwise: Joi.required()
      }),
      invited_user_id: Joi.string().uuid().when('isEdit', {
        is: true,
        then: Joi.optional(),
        otherwise: Joi.required()
      }),
    }).validate(data)
};
