/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   actions.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: nkouris <nkouris@student.42.us.org>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/06/12 22:08:10 by nkouris           #+#    #+#             */
/*   Updated: 2018/06/14 15:08:45 by nkouris          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "universal.h"
#include "events.h"
#include "inventory.h"
#include "player.h"
#include "egg.h"

static int32_t		eat(void *entity);

__attribute__((constructor))void	construct_serverevents(void)
{
	struct s_eventhold	ev2 = {"-- eat --", &eat, 126};
	struct s_eventhold	ev3 = {"-- hatch --", egg.hatch, 600};

	eventlookup[2] = ev2;
	eventlookup[3] = ev3;
}

static int32_t	eat(void *entity)
{
	t_player	*pl;

	pl = (t_player *)entity;
	printf("[ACTION]\n  -- Eating --\n  Player @ : <%d>\n", pl->c_fd);
	pl->inventory.items = inventory.rm_food(pl->inventory.items);
	printf("  Food left : <%llu>\n", pl->inventory.items);
	if (!(FOOD(pl->inventory.items)))
		player.death.soon(pl);
	else
		player.eats(pl);
	return (EXIT_SUCCESS);
}