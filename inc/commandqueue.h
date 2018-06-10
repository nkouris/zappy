/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   commandqueue.h                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: nkouris <nkouris@student.42.us.org>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/06/08 16:31:37 by nkouris           #+#    #+#             */
/*   Updated: 2018/06/09 22:35:46 by nkouris          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef COMMANDQUEUE_H
# define COMMANDQUEUE_H

typedef struct	s_commandqueue_methods
{
	t_queue		*data;
	t_queue		*pool;
	int32_t		(*check)(void);
	int32_t		(*addtoqueue)(t_dblist *);
	int32_t		(*createpool)(void);
	int32_t		(*addtopool)(void);
	t_dblist	*(*popfrompool)(void);
}				t_commandqueue_methods;

extern t_commandqueue_methods	commandqueue;

#endif